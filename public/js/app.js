let app = new Vue({
  el: '#app',
  data: {
    lessons: [
      // { subject: "Math", location: "Room 101", price: 100, spaces: 5, icon: "fas fa-calculator" },
      // { subject: "English", location: "Room 102", price: 80, spaces: 5, icon: "fas fa-book" },
      // { subject: "Science", location: "Lab 1", price: 120, spaces: 5, icon: "fas fa-flask" },
      // { subject: "History", location: "Room 103", price: 90, spaces: 5, icon: "fas fa-landmark" },
      // { subject: "Art", location: "Studio A", price: 110, spaces: 5, icon: "fas fa-palette" },
      // { subject: "Music", location: "Music Room", price: 95, spaces: 5, icon: "fas fa-music" },
      // { subject: "Physics", location: "Lab 2", price: 130, spaces: 5, icon: "fas fa-atom" },
      // { subject: "Chemistry", location: "Lab 3", price: 125, spaces: 5, icon: "fas fa-vials" },
      // { subject: "Geography", location: "Room 104", price: 85, spaces: 5, icon: "fas fa-globe" },
      // { subject: "Physical Education", location: "Gym", price: 75, spaces: 5, icon: "fas fa-dumbbell" }
    ],
    cart: [],
    showCart: false,
    checkoutName: '',
    checkoutPhone: '',
    checkoutEmail: '',
    checkoutAddress: '',
    sortAttribute: 'subject',  // default sort attribute
    sortOrder: 'asc', // default order
    searchQuery: '',
  },
  computed: {
    filteredLessons() {
      const query = this.searchQuery.toLowerCase(); // convert query to lowercase
      return this.lessons.filter(lesson => {
        return (
          lesson.subject.toLowerCase().includes(query) || // search by subject
          lesson.location.toLowerCase().includes(query) || // search by location
          lesson.price.toString().includes(query) || // search by price
          lesson.spaces.toString().includes(query) // search by available spaces
        );
      });
    },
    sortedLessons() {
      // copy lessons array to preserve default order
      let sortedArray = [...this.filteredLessons];  // filteredLessons from searchquery here

      // Sort based on the selected attribute and order
      sortedArray.sort((a, b) => {
        let valueA = a[this.sortAttribute];
        let valueB = b[this.sortAttribute];

        if (typeof valueA === 'string') {
          valueA = valueA.toLowerCase();
          valueB = valueB.toLowerCase();
        }

        if (this.sortOrder === 'asc') {
          return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
        } else {
          return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
        }
      });

      return sortedArray;
    },
    displayedLessons() {
      return this.sortedLessons;  // using sortedLessons for final lesson display
    },
    isCheckoutEnabled() {
      const nameValid = /^[a-zA-Z]+$/.test(this.checkoutName);
      const phoneValid = /^[0-9]+$/.test(this.checkoutPhone);
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.checkoutEmail);
      const addressValid = this.checkoutAddress.trim().length > 0;
      return nameValid && phoneValid && emailValid && addressValid;
    },
  },
  methods: {
    toggleSortOrder() {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    },
    addToCart(lesson) {
      // check if lesson has enough space and return if not
      if (lesson.spaces > 0) {
        // check if the lesson is already in the cart
        const cartItem = this.cart.find(item => item.subject === lesson.subject);
        if (cartItem) {
          cartItem.quantity += 1; // increase quantity
        } else {
          this.cart.push({ subject: lesson.subject, quantity: 1 });
        }
        lesson.spaces -= 1; // decrease available spaces in lessons
      }
    },
    toggleCart() {
      this.showCart = !this.showCart;
    },
    removeFromCart(cartItem) {
      const lesson = this.lessons.find(l => l.subject === cartItem.subject);
      if (cartItem.quantity > 1) {
        cartItem.quantity -= 1; // reduce quantity in the cart
      } else {
        this.cart = this.cart.filter(item => item.subject !== cartItem.subject); // Remove item from cart if quantity is 1
      }
      lesson.spaces += 1; // increase available spaces in lessons
    },
    validateName() {
      this.checkoutName = this.checkoutName.replace(/[^a-zA-Z]/g, '');
    },
    validatePhone() {
      this.checkoutPhone = this.checkoutPhone.replace(/[^0-9]/g, '');
    },
    validateEmail() {
      this.checkoutEmail = this.checkoutEmail.replace(/[^a-zA-Z0-9@._-]/g, '');
    },
    checkout() {
      alert(`Order for ${this.checkoutName} has been submitted.`);
      this.cart.forEach(cartItem => {
        const lesson = this.lessons.find(l => l.subject === cartItem.subject);
        lesson.spaces += cartItem.quantity; // restore spaces from cart quantity
      });
      this.cart = [];
      this.checkoutName = '';
      this.checkoutPhone = '';
      this.checkoutEmail = '';
      this.checkoutAddress = '';
      this.showCart = false;
    }
  },
  created(){
    fetch('collections/lessons').then((res)=>res.json()).then((d) => this.lessons = d )
  }
});
