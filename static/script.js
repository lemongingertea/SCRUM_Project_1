// Fetch and display courses when the page loads
document.addEventListener('DOMContentLoaded', function () {
  fetch('/listCourses', {
      method: 'POST',
  })
  .then(response => response.json())
  .then(data => {
      displayCourses('closedCoursesList', data.closed_courses, true);
      displayCourses('openCoursesList', data.open_courses, false);
  })
  .catch(error => {
      console.error('There was an error!', error);
      document.getElementById('message').textContent = 'Error listing courses';
  });
});

// Display cart items
displayCart(getCart());

// Function to display courses
function displayCourses(containerId, courses, showAddButton) {
  const courseListContainer = document.getElementById(containerId);

  for (const course of courses) {
      const courseDiv = document.createElement('div');
      courseDiv.classList.add('course');

      const heading = document.createElement('h3');
      heading.textContent = course.course_name;
      courseDiv.appendChild(heading);

      const professorLink = document.createElement('a');
      professorLink.href = course.course_link;
      professorLink.title = `View Rate My Professor: ${course.professor}`;
      professorLink.classList.add('link');
      professorLink.textContent = `Professor: ${course.professor}`;
      courseDiv.appendChild(professorLink);

      const descriptionParagraph = document.createElement('p');
      descriptionParagraph.textContent = course.course_description;
      courseDiv.appendChild(descriptionParagraph);

      if (showAddButton) {
        const addButton = document.createElement('button');
        addButton.classList.add('btn');
        addButton.textContent = 'Add';
        
        // Pass the button and course to the toggleButton function
        addButton.addEventListener('click', function() {
          toggleButton(addButton, course);
          displayCart(getCart());
        });
  
        courseDiv.appendChild(addButton);
      }
  
      courseListContainer.appendChild(courseDiv);
    }
  }

  function toggleButton(button, course) {
    button.classList.toggle('added');
    button.textContent = button.classList.contains('added') ? 'Added' : 'Add';
  
    // Check button state and perform actions
    if (button.classList.contains('added')) {
      addToCart(course);
    } else {
      removeFromCart(course);
    }
  }

// Function to add a course to the cart in localStorage
function addToCart(course) {
  // Retrieve existing cart data or initialize an empty array
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Add the selected course to the cart
  cart.push(course);

  // Save the updated cart data back to localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to remove a course from the cart in localStorage
function removeFromCart(course) {
  // Retrieve existing cart data or initialize an empty array
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Remove the selected course from the cart
  const updatedCart = cart.filter(item => item.course_id !== course.course_id);

  // Save the updated cart data back to localStorage
  localStorage.setItem('cart', JSON.stringify(updatedCart));
}

// Function to retrieve cart items from localStorage
function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

// Function to display cart items
function displayCart(cart) {
  const cartListContainer = document.getElementById('cartList');
  if (!cartListContainer) {
    console.error('Element with ID "cartList" not found.');
    return;
  }
  cartListContainer.innerHTML = ''; // Clear existing content

  for (const item of cart) {
    const cartItemDiv = document.createElement('div');
    cartItemDiv.classList.add('cart-item');

    const heading = document.createElement('h3');
    heading.textContent = item.course_name;
    cartItemDiv.appendChild(heading);

    const professorLink = document.createElement('a');
    professorLink.href = item.course_link;
    professorLink.title = `View Rate My Professor: ${item.professor}`;
    professorLink.classList.add('link');
    professorLink.textContent = `Professor: ${item.professor}`;
    cartItemDiv.appendChild(professorLink);

    const descriptionParagraph = document.createElement('p');
    descriptionParagraph.textContent = item.course_description;
    cartItemDiv.appendChild(descriptionParagraph);

    const removeButton = document.createElement('button');
    removeButton.classList.add('btn', 'remove-btn');
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', function () {
      removeFromCart(item);
      displayCart(getCart()); // Refresh the cart display after removing
    });
    cartItemDiv.appendChild(removeButton);

    cartListContainer.appendChild(cartItemDiv);
  }
}


















 
//Sign Up Function
function signUp() {
    var firstName = document.getElementById("firstName").value;
    var lastName = document.getElementById("lastName").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    console.log("First Name: " + firstName);
    console.log("Last Name: " + lastName);
    console.log("Email: " + email);
    console.log("Password: " + password);
  }

  //Scroll Button
document.addEventListener('DOMContentLoaded', function () {
    window.onscroll = function () {
      scrollFunction();
    };
  
    window.scrollToTop = function () {
      const scrollDuration = 500; 
      const scrollStep = -window.scrollY / (scrollDuration / 15);
  
      const scrollInterval = setInterval(function () {
        if (window.scrollY !== 0) {
          window.scrollBy(0, scrollStep);
        } else {
          clearInterval(scrollInterval);
        }
      }, 15);
    };
  });
  
  function scrollFunction() {
    var scrollToTopBtn = document.getElementById('scrollToTopBtn');
  
    if (
      document.body.scrollTop > 20 ||
      document.documentElement.scrollTop > 20
    ) {
      scrollToTopBtn.style.display = 'block';
    } else {
      scrollToTopBtn.style.display = 'none';
    }
  }
  
  //Scroll Func
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
  
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
  });


