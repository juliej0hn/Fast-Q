var timerInterval=null;

function startCountdown(slotDate, slotTime){

    document.getElementById('step-booked').className='step done';
    document.getElementById('step-transit').className='step active';
    document.getElementById('step-lobby').className='step';
    document.getElementById('step-session').className='step';

    var display=document.getElementById('countdown');
    var labelEl=document.getElementById('timer-label');

    if(timerInterval){
        clearInterval(timerInterval);
        timerInterval=null;
    }
    var appointmentDate = new Date(slotDate +'T'+slotTime+':00');
    labelEl.textContent='Until ' + formatDate(slotDate) + ' at ' + formatTime(slotTime);

    function tick(){
        var now =new Date();
        var diffMs= appointmentDate.getTime()- now.getTime();

        if(diffMs<=0){
            clearInterval(timerInterval);
            timerInterval=null;
            display.textContent='00:00';
            labelEl.textContent = '⏰ Time to go!';
            alert('Your appointment time has arrived -time to leave!');
            return;
        }

        var totalSecs = Math.floor(diffMs / 1000);
        var days=Math.floor(totalSecs / 86400);
        var hrs=Math.floor((totalSecs % 86400) / 3600);
        var mins=Math.floor((totalSecs % 3600) / 60);
        var secs=totalSecs % 60;

        if(days>0){
            display.textContent=days+(days===1? ' day ' : ' days ');
        }
        else if(hrs>0){
            display.textContent = 
            (hrs<10? '0' +hrs :''+hrs)+':'+
            (mins<10?'0'+mins :''+mins)+':'+
            (secs<10?'0'+secs :''+secs);
        }
        else{
            display.textContent=
            (mins<10?'0'+ mins :''+mins)+ ':'+
            (secs<10?'0'+secs :''+secs);

        }

    }
    tick();
    timerInterval=setInterval(tick,1000);

}