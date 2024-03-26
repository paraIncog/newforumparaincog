function togglePMPerson(userId, isInPMPersonList) {
	if (isInPMPersonList) {
		// Remove user from the private message list
		removeFromPMPersonList(userId);
	  } else {
		// Add user to the private message list
		addPMPerson(userId);
	  }
}

function addPMPerson(userId) {
	// Logic to add the user to the private message list
  }
  
  function removeFromPMPersonList(userId) {
	// Logic to remove the user from the private message list
  }