//1.loginform
async function handleLoginFormSubmit(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();

        if (response.ok) {
            if (data.user.role === 'admin') {
                window.location.href = 'home.html';
            } else if (data.user.role === 'user') {
                window.location.href = 'user.html';
            }
        } else {
            alert('Invalid username or password');
        }
    } catch (error) {
        console.error('Error logging in:', error);
        alert('An error occurred while logging in');
    }
}

function handleRequestLinkClick(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const mailtoLink = `mailto:nofar.shamir7@gmail.com?subject=New%20User%20Request&body=Please%20add%20a%20new%20user%20to%20the%20system.%0D%0A%0D%0AUsername:%20${username}%0D%0APassword:%20${password}`;
    window.location.href = mailtoLink;
}

function handleVideoCanPlay() {
    const video = document.getElementById('video');
    video.play();
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loginForm');
    form.addEventListener('submit', handleLoginFormSubmit);
    const requestLink = document.getElementById('requestLink');
    requestLink.addEventListener('click', handleRequestLinkClick);
    const video = document.getElementById('video');
    video.addEventListener('canplay', handleVideoCanPlay);
});

//2.bodyform
const fetchFunction = (html) => {
    fetch(html)
        .then(response => response.text())
        .then(htmlContent => {
            document.getElementById('body').innerHTML = htmlContent;
        });
}

// 3.add New Flight
async function addNewFlight() {
    event.preventDefault();
    const destination = document.getElementById('destination').value;
    const origin = document.getElementById('origin').value;
    const dateInput = document.getElementById('date').value;
    const hour = document.getElementById('hour').value;
    const terminal = document.getElementById('terminal').value;
    const price = document.getElementById('price').value;

    const selectedDate = new Date(convertDateFormat(dateInput));
    const currentDate = new Date();

  
    if (selectedDate <= currentDate) {
        alert('The flight date has passed!, please change the date.');
        return;
    }
    
    if (price <= 0) {
        alert('Price must be greater than 0.');
        return;
    }
    
    const flight = {
        destination,
        origin,
        date: dateInput, 
        hour,
        terminal,
        price
    };

    try {
        document.getElementById('destination').value = '';
        document.getElementById('origin').value = '';
        document.getElementById('date').value = '';
        document.getElementById('hour').value = '';
        document.getElementById('terminal').value = '';
        document.getElementById('price').value = '';

        const response = await fetch('/flight', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(flight),
        });

        if (response.ok) {
            console.log('Flight added successfully!');
            fetchFlight(); 
            alert('Flight added successfully!');

        } else {
            console.error('Failed to add flight:', response.statusText);
            alert('Failed to add flight. Please try again later.');
        }

    } catch (error) {
        console.error('Error adding flight:', error);
        alert('An error occurred while adding the flight. Please try again later.');
    }
}

//4.Date input
function convertDateFormat(inputDate) {
    const parts = inputDate.split('/');
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

//5.show Flight
async function fetchFlight() {
    const response = await fetch('/flight');
    const data = await response.json();

    const flightList = document.getElementById('flightList');
    flightList.innerHTML = '';

    data.forEach((flight) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${flight.destination}</td>
            <td>${flight.origin}</td>
            <td>${flight.date}</td>
            <td>${flight.hour}</td>
            <td>${flight.terminal}</td>
            <td>${flight.price}</td>
        `;
        flightList.appendChild(row);
    });
}
fetchFlight();

//6.add New Opinion
async function addNewOpinion() {
    event.preventDefault(); 
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    const rating = document.querySelector('input[name="rating"]:checked').value;

    const opinion = {
        name,
        email,
        subject,
        message,
        rating
    };

    try {
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        document.getElementById('subject').value = '';
        document.getElementById('message').value = '';
        document.querySelector('input[name="rating"]:checked').checked = false;
        
        const response = await fetch('/opinion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(opinion),
        });

        if (response.ok) {
            console.log('Opinion added successfully!');
            fetchOpinion(); 
            alert('Opinion added successfully!');

        } else {
            console.error('Failed to add Opinion:', response.statusText);
            alert('Failed to add Opinion. Please try again later.');

        }

    } catch (error) {
        console.error('Error adding Opinion:', error);
        alert('An error occurred while adding the Opinion. Please try again later.');
    }
}

//7.show card Opinion
async function fetchOpinion() {
    const response = await fetch('/opinion');
    const data = await response.json();

    const opinionList = document.getElementById('opinionList');
    opinionList.innerHTML = '';

    data.forEach((opinion) => {
        const card = document.createElement('div');
        card.classList.add('opinion-card');

        card.innerHTML = `
            <h2><br>${opinion.subject}</h2>
            <h1>${opinion.name}</h1>
            <p>${opinion.email}</p>
            <h1>${opinion.rating}&nbspstars</h1>
            <p>${opinion.message}</p><br>   
        `;

        opinionList.appendChild(card);
    });
}
fetchOpinion();

//8.show Graph
function showGraph() {
    fetch('/opinion')
        .then(response => response.json())
        .then(data => {
            const opinions = data;
            const dataByDestination = {}; // Initialize data object to store rating counts and ratings sum by destination

            opinions.forEach(opinion => {
                const destination = opinion.subject; // Assuming the subject represents the destination
                const rating = parseInt(opinion.rating);

                if (!dataByDestination[destination]) {
                    dataByDestination[destination] = {
                        ratings: [],
                    };
                }

                dataByDestination[destination].ratings.push(rating);
            });

            const graphContainer = document.getElementById('barGraph');
            graphContainer.innerHTML = ''; // Clear any previous graph

            // Calculate the maximum score to determine logarithmic scaling
            let maxScore = 0;
            for (const destination in dataByDestination) {
                const ratingsMax = Math.max(...dataByDestination[destination].ratings);
                if (ratingsMax > maxScore) {
                    maxScore = ratingsMax;
                }
            }

            for (const destination in dataByDestination) {
                const barContainer = document.createElement('div');
                barContainer.classList.add('bar-container');

                const destinationTitle = document.createElement('div');
                destinationTitle.classList.add('destination-title');
                destinationTitle.textContent = destination;
                barContainer.appendChild(destinationTitle);

                const averageRating = document.createElement('div');
                averageRating.classList.add('average-rating');

                const ratingsSum = dataByDestination[destination].ratings.reduce((sum, rating) => sum + rating, 0);
                const average = ratingsSum / dataByDestination[destination].ratings.length;
                averageRating.textContent = `${average.toFixed(2)}★`;

                barContainer.appendChild(averageRating);

                // Use logarithmic scaling for height
                const normalizedHeight = (Math.log(average + 3) / Math.log(maxScore + 1)) * 200; // Adjust scaling as needed

                const bar = document.createElement('div');
                bar.classList.add('bar');
                bar.style.height = `${normalizedHeight}px`; // Set the bar height based on logarithmic scale
                barContainer.appendChild(bar);

                graphContainer.appendChild(barContainer);
            }
        })
        .catch(error => {
            console.error('Error fetching opinions:', error);
        });
}

showGraph();

//9.search by Destination
async function searchFlights() {
    const destinationInput = document.getElementById('destination');
    const destination = destinationInput.value;

    const response = await fetch('/flight');
    const data = await response.json();

    const flightList = document.getElementById('flightList');
    flightList.innerHTML = '';

    data.forEach((flight) => {
        if (flight.destination === destination) {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${flight.destination}</td>
            <td>${flight.origin}</td>
            <td>${flight.date}</td>
            <td>${flight.hour}</td>
            <td>${flight.terminal}</td>
            <td>${flight.price}</td>
            `;
            flightList.appendChild(row);
        }
    });

    destinationInput.value = '';
}

//10. show Specific Destination
async function showSpecificDestinationInput() {
    const container = document.getElementById('specificDestinationInputContainer');
    container.style.display = 'block';
}

//11.search Flights By Price
async function searchFlightsByPriceRange() {
    const destinationInput = document.getElementById('destination');
    const destination = destinationInput.value;

    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    const minPrice = parseFloat(minPriceInput.value);
    const maxPrice = parseFloat(maxPriceInput.value);

    // Check if the entered prices are valid and positive
    if (isNaN(minPrice) || isNaN(maxPrice) || minPrice < 0 || maxPrice < 0) {
        alert('Please enter valid positive numbers for the price range.');
        return;
    }
    
    const response = await fetch('/flight');
    const data = await response.json();

    const flightList = document.getElementById('flightList');
    flightList.innerHTML = '';

    let flightsFound = false; // Starting point - no matching flights found

    data.forEach((flight) => {
        const flightPrice = parseFloat(flight.price);
        if (
            flight.destination === destination &&
            flightPrice >= minPrice &&
            flightPrice <= maxPrice
        ) {
            flightsFound = true; // Matching flight found
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${flight.destination}</td>
            <td>${flight.origin}</td>
            <td>${flight.date}</td>
            <td>${flight.hour}</td>
            <td>${flight.terminal}</td>
            <td>${flight.price}</td>
            `;
            flightList.appendChild(row);
        }
    });

    if (!flightsFound) {
        alert('No flights found matching the criteria.'); // Error message
    }
    
    destinationInput.value = '';
    minPriceInput.value = '';
    maxPriceInput.value = '';
}

//12.add discount for all
async function discountFlight() {
    const discount = parseFloat(document.getElementById('discount').value);
    addNewCoupon()

    try {
        document.getElementById('discount').value = '';
        const response = await fetch('/updateAllFlights', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ discount }) 
        });

        const data = await response.json();
        const updatedFlightsArray = Object.values(updatedFlights);
        const flightList = document.getElementById('flightList');
        flightList.innerHTML = '';

        data.flights.forEach((flight) => {
            flightList.innerHTML += `<tr>
                <td>${flight.destination}</td>
                <td>${flight.origin}</td>
                <td>${flight.date}</td>
                <td>${flight.hour}</td>
                <td>${flight.terminal}</td>
                <td>${flight.price}</td>
            </tr>`;
        });
    } catch (error) {
        console.error('Error updating and displaying flights:', error);
    }
    displayMessageBanner('All Flights', 'Discount Applied to All', 'New Price', discount);
}

discountFlight();

//13.ADD discount for specific
async function applyDiscount() {
    const specific = document.getElementById('specific').value;
    const discount = parseFloat(document.getElementById('discount').value);
    await addNewCoupon();

    try {
        document.getElementById('specific').value = '';
        document.getElementById('discount').value = '';
        const response = await fetch('/updateDiscount', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ specific, discount }),
        });

        const updatedFlights = await response.json();
        const updatedFlight = updatedFlights.find(flight => flight.destination === specific);

        if (updatedFlight) {

            const oldPrice = updatedFlight.oldPrice; 
            const newPrice = updatedFlight.price;

            displayUpdatedFlights(updatedFlights);
            displayMessageBanner(specific, oldPrice, newPrice, discount);

        } else {
            console.log(`No updated flight found for destination ${specific}`);
        }

    } catch (error) {
        console.error('Error updating and displaying flights:', error);
    }
}

//14.show  Flight
async function displayUpdatedFlights(updatedFlights) {
    const flightList = document.getElementById('flightList');
    flightList.innerHTML = '';

    updatedFlights.forEach((flight) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${flight.destination}</td>
            <td>${flight.origin}</td>
            <td>${flight.date}</td>
            <td>${flight.hour}</td>
            <td>${flight.terminal}</td>
            <td>${flight.price}</td>
        `;
        flightList.appendChild(row);
    });
}

//15.show Banner discount 
async function displayMessageBanner(destination, oldPrice, newPrice, discount) {
    
    const messageBanner = document.createElement('div');
    messageBanner.classList.add('message-banner');

    const bannerContent = document.createElement('div');
    bannerContent.innerHTML = `
        <div class="banner-row center-text">
            <span class="sale-text">SALE!</span><br><br>
        </div>
        <div class="banner-row">
            <strong>${destination}</strong><br>
        </div>
        <div class="banner-row">
            <span class="discount-percentage green-text">Discount: -${discount*100}%</span><br>
        </div>
        ${
            destination !== 'All Flights'
                ? `
                <div class="banner-row">
                    <span class="price-details">
                        <span id="oldPriceSpan" class="old-price">${newPrice/(1-discount)}</span>
                        <span id="newPriceSpan" class="new-price">${newPrice}</span>
                    </span>
                </div><br>
            `
                : ''
        }
        <br>
        <div class="banner-row center-text">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp
        &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp
            <button class="see-discount-button gold-button larger-button">See Discount</button>
        </div>
        <span class="close-button">&times;</span>
    `;

    messageBanner.appendChild(bannerContent);
    document.body.appendChild(messageBanner);

    // Handle banner close button
    const closeButton = bannerContent.querySelector('.close-button');
    closeButton.addEventListener('click', () => {
        document.body.removeChild(messageBanner);
    });

    const seeDiscountButton = bannerContent.querySelector('.see-discount-button');
    seeDiscountButton.addEventListener('click', () => {
        if (destination === 'All Flights') {
            fetchFunction('search.html');
            setTimeout(() => {
                fetchFlight(); 
            }, 500); 
        } else {
            fetchFunction('search.html');
            setTimeout(() => {

                document.getElementById('destination').value = destination;
                searchFlights(); 
            }, 500); 
        }
    });

    setTimeout(() => {
        document.body.removeChild(messageBanner);
    }, 9000);     
}

//16.trigger Banner
async function triggerBannerFromButton() {
    try {
        const response = await fetch('/coupon');
        const data = await response.json();
        const response2 = await fetch('/flight');
        const data2 = await response2.json();

        if (data.length > 0) {
            const coupon = data[data.length - 1];
            const discount = coupon.discount;
            const destination = coupon.specific || 'All Flights';
            
            let oldPrice;
            
            for (const flight of data2) {
                if (flight.destination === destination) {
                    oldPrice = (flight.price) / (1 - discount);
                    break; 
                }
            }
            
            const newPrice = oldPrice * (1 - discount);
            displayMessageBanner(destination, oldPrice, newPrice, discount);
        }
        
    } catch (error) {
        console.log(error);
    }
}

//17.fetch Coupon
async function fetchCoupon() {
    const response = await fetch('/coupon');
    const data = await response.json();

    const couponList = document.getElementById('couponList');
    const couponDiscountElement = document.getElementById('couponDiscount');
    const couponSpecificElement = document.getElementById('couponSpecific');
    
    couponList.innerHTML = '';
    couponDiscountElement.textContent = '';
    couponSpecificElement.textContent = ' ';

    
    couponDiscountElement.textContent = coupon.discount;
    couponSpecificElement.textContent = coupon.specific;
    

    data.forEach((coupon) => {
        const discountElement = document.createElement('p');
        const specificElement = document.createElement('p');

        discountElement.textContent = `Discount: ${coupon.discount}`;
        specificElement.textContent = `Specific: ${coupon.specific}`;

        couponList.appendChild(discountElement);
        couponList.appendChild(specificElement);

        couponDiscountElement.textContent = coupon.discount;
        couponSpecificElement.textContent = coupon.specific;
    });
}

//18.add Coupon
async function addNewCoupon() {
    event.preventDefault(); 
    const discount = document.getElementById('discount').value;
    const specific = document.getElementById('specific').value;

    const coupon = {
        discount,
        specific
    };

    try {
        const response = await fetch('/coupon', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(coupon),
        });

        if (response.ok) { 
            console.log('Coupon added successfully!');
            fetchCoupon();
            alert('Coupon added successfully!');

        } else {
            console.error('Failed to add discount:', response.statusText);
            alert('Failed to add coupon. Please try again later.');
        }

    } catch (error) {
        console.error('Error adding discount:', error);
        alert('An error occurred while adding the coupon. Please try again later.');
    }
}

//19. fetch LastI tem
async function fetchLastItem() {
    try {
        const response = await fetch('/coupon');
        const data = await response.json();

        if (data.length > 0) {
            const coupon = data[data.length - 1];
            const couponDiscountElement = document.getElementById('couponDiscount');
            const couponSpecificElement = document.getElementById('couponSpecific');

            couponDiscountElement.textContent = `Discount: ${coupon.discount}`;
            couponSpecificElement.textContent = `Specific: ${coupon.specific}`;
        }

    } catch (error) {
        console.log(error);
    }
}

//20.add New user
async function addNewUser() {
    event.preventDefault(); 
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    
    if (username.trim() === '' || password.trim() === '') {
        alert('Username and password are required.');
        return;
    }
    const user = {
        username,
        password,
        role
    };

    try {
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        const response = await fetch('/customer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });

        if (response.ok) {
            console.log('User added successfully!');
            fetchUser(); // Update the user list
            alert('User added successfully!');

        } else {
            console.error('Failed to add user:', response.statusText);
            alert('Failed to add user. Please try again later.');
        }

    } catch (error) {
        console.error('Error adding user:', error);
        alert('An error occurred while adding the user. Please try again later.');
    }
}

//21.delete User
async function deleteUser(username) {
    try {
        const response = await fetch(`/customer/${username}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            console.log('User deleted successfully!');
            fetchUser(); 
            alert('User deleted successfully!');

        } else {
            console.error('Failed to delete user:', response.statusText);
            alert('Failed to delete user. Please try again later.');

        }
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('An error occurred while deleting the user. Please try again later.');
    }
}

//22. show User
async function fetchUser() {
    const response = await fetch('/customer');
    const data = await response.json();

    const userList = document.getElementById('userList');
    userList.innerHTML = '';

    data.forEach((user) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.password}</td>
            <td>${user.role}</td>
            <td><label class="switch">
            <input type="checkbox" checked>
            <span class="slider round" onclick="deleteUser('${user.username}')"> </td>
        `;
        userList.appendChild(row);
    });
}

fetchUser();

 //23. add Feedback email
 async function submitFeedback() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const feedback = document.getElementById('feedback').value;

    const formData = {
        name: name,
        email: email,
        feedback: feedback
    };

    fetch('/submitFeedback', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error('Error submitting feedback:', data.error);
            alert('An error occurred while submitting feedback.');

        } else {
            console.log('Feedback submitted successfully:', data.message);
            alert(data.message);
            
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('feedback').value = '';
        }
    })
    .catch(error => {
        console.error('Error submitting feedback:', error);
        alert('An error occurred while submitting feedback.');
    });
}



