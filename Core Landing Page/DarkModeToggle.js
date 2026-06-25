if(localStorage.getItem('fq-theme')==='dark'){
    document.body.classList.add('dark');
    document.getElementById('dark-knob').textContent='☀️';
}

function toggleDark(){
    document.body.classList.toggle('dark');
    var isDark = document.body.classList.contains('dark');
    document.getElementById('dark-knob').textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('fq-theme', isDark ? 'dark':'light');
}