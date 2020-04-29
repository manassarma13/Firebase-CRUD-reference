const userId = document.getElementById('userId');
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const age = document.getElementById('age');
const addBtn = document.getElementById('addBtn');
const updateBtn = document.getElementById('updateBtn');
const removeBtn = document.getElementById('removeBtn'); 

//Need to change access to database first. Database>Rules> read and write: changed both to true
const database = firebase.database();                   //Access Firebase functions- created an instance of firebase database
const usersRef = database.ref('/users');

//add button

addBtn.addEventListener('click', e => {                 //click event to the add button
  e.preventDefault();
  const autoId = usersRef.push().key                    //for id to be automatically generated 
  usersRef.child(autoId).set({                          //set method - add new data. It takes object as parameter to add
    first_name: firstName.value,
    last_name: lastName.value,
    age: age.value
  });
});

//update button

updateBtn.addEventListener('click', e => {
  e.preventDefault();
  const newData = {
      first_name: firstName.value,
      last_name: lastName.value,
      age: age.value
  };
  const autoId = usersRef.push().key;
  const updates = {};
  updates['/users/' + autoId] = newData;
  updates['/super-users/' + autoId] = newData;
  database.ref().update(updates);
});

//remove button

removeBtn.addEventListener('click', e => {
    e.preventDefault();
    usersRef.child(userId.value).remove()
    .then(()=> { console.log('User Deleted !'); })
    .catch(error => { console.error(error); });
});

/* To read data in Firebase Realtime Database, attach a listener to a reference or multiple references 
in the database. Hence we need to use the on method, then we can set different events to listen to.
 */

//child add event
// To check go to Browser>Inspect>Console

usersRef.on('child_added', snapshot => {   
    console.log('Child added !');
});

// child updated

usersRef.on('child_changed', snapshot => {
    console.log('Child updated !');
});

//child removed

usersRef.on('child_removed', snapshot => {
    console.log('Child removed !');
});

// determine change

usersRef.on('value', snapshot => {
    console.log('An event occured !');
});


/* the once method which as its name suggests, 
it listens to an event only one time and then triggers the callback function. 
So if the event occurs again, the callback function will not get triggered a second time */

usersRef.once('child_removed', snapshot => {
    console.log('Child removed !');
});

/* When we want to get the new values provided when the child_changed event occurs, 
 we can use the val method of the snapshot object. */

 usersRef.on('child_added', snapshot => {
    console.log(snapshot.val());
});

 /*  A query is composed of a reference, an ordering function and a querying function. 
 At first, data gets ordered based on a certain criterion, then it gets filtered by the querying function also based on another criterion.
 */


 //orderByKey

 usersRef.orderByKey().limitToLast(2).on('value', snapshot => {
    console.log(snapshot.val()); //This query returns the 2 newest users in the users’ reference since we used the limitToLast(2) ordering function
 //However if we used limitToFitst(2) we would get the oldest users (based on when they got added to the reference, not the age).
});

//orderByChild

usersRef.orderByChild('age').limitToFirst(2).on('value', snapshot => {
    console.log(snapshot.val());
});  //This query will return the 2 youngest users.

//Second example:
usersRef.orderByChild('first_name').startAt('P').on('value', snapshot => {
    console.log(snapshot.val());
}); //startAt takes a whole range of data as criterion not only a single one

//orderByValue

usersRef.orderByValue().limitToFirst(3).on('value', snapshot => {
    console.log(snapshot.val());
});
