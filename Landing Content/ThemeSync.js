window.addEventListener('storage',function(e){
if(e.key==='fq-theme'){
    var isDark= e.newValue==='dark';
    document.body.classList.toggle('dark',isDark);
    document.getElementById('dark-knob').textContent=isDark ? '☀️' : '🌙';
}
}
);