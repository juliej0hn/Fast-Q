function handleAuth(event) {
    
    event.preventDefault(); 
    
    var email = document.getElementById('email').value.trim(); 
    var password = document.getElementById('password').value;

    if (!email || !password) {
        alert('Please enter your email and password.');
        return;
    }
    
    
    if (state.isSignup) { 
        var first = document.getElementById('first-name').value.trim();
        var last = document.getElementById('last-name').value.trim();
        
        if (!first || !last) {
            alert('Please enter your first and last name.');
            return;
        }
        state.clientName = first + ' ' + last;
    } else {
        state.clientName = email.split('@')[0];
    }
    
    if (state.role === 'host') {
        navigateTo('host-dashboard');
    } else {
        navigateTo('user-dashboard');
    }
}