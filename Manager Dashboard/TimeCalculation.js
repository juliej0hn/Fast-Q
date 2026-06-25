
function formatDate(dateStr){
    var d= new Date (dateStr + 'T00:00:00');
    return d.getDate()+ ' '+ getMonthStr(dateStr)+ ' ' + d.getFullYear();

}

function getMonthStr(dateStr){
    var months=['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    var d = new Date(dateStr+'T00:00:00');
    return months[d.getMonth()];
}

function getDayNum(dateStr){
    return new Date(dateStr + 'T00:00:00').getDate();
}

function formatTime(time24){
    var parts= time24.split(':');
    var h=parseInt(parts[0]);
    var m =parts[1];
    var ampm = h >=12? 'PM':'AM';
    h = h % 12;
    if(h===0)  h=12;
    return h +':'+m+' '+ampm;

}

function slotLabel(slot){
    return formatDate(slot.date)+' · ' +formatTime(slot.time);
    
}