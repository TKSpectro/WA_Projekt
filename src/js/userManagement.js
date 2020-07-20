function updateUserPressed(elm) {
    alert('UPDATE');
}

function deleteUserPressed(elm) {
    if (confirm('Are you sure you want to delete this user?')) {
        // Save it!
        console.log('Thing was deleted.');
      } else {
        // Do nothing!
        console.log('Thing was not deleted.');
      }
}