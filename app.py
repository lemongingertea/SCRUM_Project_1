from flask import Flask, render_template, request, redirect, url_for, jsonify, session
import pymysql
import bcrypt

app = Flask(__name__, static_url_path='/static', static_folder='static')
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'

def hash_password(password):
    # Generate a random salt
    salt = bcrypt.gensalt()
    # Hash the password with the salt
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed_password, salt

def verify_password(password, hashed_password, salt):
    # Check if the provided password matches the hashed password
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password)


@app.route('/')
def home():
    return render_template("login.html")

DB_HOST = '107.180.1.16'
DB_USER = 'spring2024Cteam14'
DB_PASS = 'spring2024Cteam14'
DB_NAME = 'spring2024Cteam14'

@app.route('/signout')
def signout():
    session.pop('userID', None)  
    return render_template("login.html") 

@app.route('/homepg')
def homepg():
    return render_template("homepg.html")

@app.route('/createacc')
def createacc():
    return render_template("createacc.html")

@app.route('/cart')
def cart():
    return render_template('cart.html')  


def connect_to_database():
    return pymysql.connect(host=DB_HOST, user=DB_USER, password=DB_PASS, database=DB_NAME)

def check_credentials(email, password):
    conn = connect_to_database()
    cursor = conn.cursor()
    query = "SELECT password_hash, salt FROM users WHERE email = %s"
    cursor.execute(query, (email,))
    user = cursor.fetchone()
    conn.close()
    return user

@app.route('/submit', methods=['POST'])
def handle_data():
    conn = connect_to_database()
    if conn is not None:
        cursor = conn.cursor()
        fname = request.form['firstName']
        lname = request.form['lastName']
        email = request.form['email']
        password = request.form['password']
        
        # Hash the password
        hashed_password, salt = hash_password(password)
        
        query = "INSERT INTO users (first_name, last_name, email, password_hash, salt) VALUES (%s, %s, %s, %s, %s)"
        cursor.execute(query, (fname, lname, email, hashed_password, salt))
        conn.commit()  # Commit the transaction
        
        cursor.close()
        conn.close()
        
        # Redirect to the submission successful page
        return redirect(url_for('submission_successful'))
    else:
        return "Database connection failed", 500
    
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Missing email or password'}), 400

    user = check_credentials(email, password)

    if user:
        hashed_password = user[0]
        salt = user[1]
        if verify_password(password, hashed_password.encode('utf-8'), salt.encode('utf-8')):
            session['userID'] = email
            return jsonify({'message': 'Login successful!'}), 200
        else:
            return jsonify({'error': 'Invalid credentials'}), 401
    else:
        return jsonify({'error': 'Invalid credentials'}), 401


@app.route('/submission-successful')
def submission_successful():
    return redirect(url_for('homepg'))

@app.route('/listCourses', methods=['POST'])
def listCourses():
    conn = connect_to_database()
    cursor = conn.cursor()

    # Query closed courses
    closed_courses_query = "SELECT course_id, course_name, course_description, professor, course_link, is_open FROM courses WHERE is_open = 0"
    cursor.execute(closed_courses_query)
    closed_courses = [dict(zip([column[0] for column in cursor.description], row)) for row in cursor.fetchall()]

    # Query open courses
    open_courses_query = "SELECT course_id, course_name, course_description, professor, course_link, is_open FROM courses WHERE is_open = 1"
    cursor.execute(open_courses_query)
    open_courses = [dict(zip([column[0] for column in cursor.description], row)) for row in cursor.fetchall()]

    conn.close()

    return jsonify({'closed_courses': closed_courses, 'open_courses': open_courses}), 20

# Add this to your Flask app
@app.route('/notification_page')
def notification_page():
    return render_template('notification_page.html')


if __name__ == '__main__':
    app.run(debug=True)





 