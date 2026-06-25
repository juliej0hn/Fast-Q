
function openModal(bizName) {
    state.currentProvider = bizName;

    var biz = null;
    for (var i = 0; i < state.businesses.length; i++) {
        if (state.businesses[i].name === bizName) {
            biz = state.businesses[i];
            break;
        }
    }
    if (!biz) return;

    var select = document.getElementById('service-select');
    select.innerHTML = '';
    for (var j = 0; j < biz.services.length; j++) {
        var svc = biz.services[j];
        var opt = document.createElement('option');
        opt.value = j;
        opt.textContent = svc.name + ' (' + svc.duration + 'm)';
        select.appendChild(opt);
    }
    state.selectedService = biz.services[0];

    var tagsEl = document.getElementById('feature-tags');
    tagsEl.innerHTML = '';
    var featureLabels = {
        ai: '🔔 Smart Reminders',
        pay: '💳 Online Payment',
        doc: '👨‍⚕️ Choose Provider',
        arr: '📍 Arrival Tracking',
        dur: '⏱ Duration Estimate',
        email: '📧 Email Reminders'
    };
    var keys = Object.keys(biz.features);
    for (var k = 0; k < keys.length; k++) {
        var key = keys[k];
        if (biz.features[key]) {
            var tag = document.createElement('span');
            tag.className = 'feat-tag';
            tag.textContent = featureLabels[key];
            tagsEl.appendChild(tag);
        }
    }

    var slotsEl = document.getElementById('time-slots');
    slotsEl.innerHTML = '';
    for (var s = 0; s < biz.slots.length; s++) {
        var slot = biz.slots[s];
        var isPeak = (s === 1);
        var label = slotLabel(slot);

        var btn = document.createElement('button');
        btn.className = 'time-slot ' + (isPeak ? 'peak' : 'low');
        btn.dataset.date = slot.date;
        btn.dataset.time = slot.time;
        btn.dataset.label = label;
        btn.innerHTML =
            '<span class="slot-date-tag">' + getMonthStr(slot.date) + ' ' + getDayNum(slot.date) + '</span>'
            + '<span>' + formatTime(slot.time) + '</span>'
            + '<small>' + (isPeak ? 'Peak Traffic' : 'Optimal') + '</small>';

        btn.onclick = function () {
            var allSlots = document.querySelectorAll('.time-slot');
            for (var x = 0; x < allSlots.length; x++) {
                allSlots[x].classList.remove('selected');
            }
            this.classList.add('selected');
        };

        slotsEl.appendChild(btn);
    }

    document.getElementById('modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modal').classList.add('hidden');
}

function updateService() {
    var select = document.getElementById('service-select');
    var biz = null;
    for (var i = 0; i < state.businesses.length; i++) {
        if (state.businesses[i].name === state.currentProvider) {
            biz = state.businesses[i];
            break;
        }
    }
    if (biz) {
        state.selectedService = biz.services[parseInt(select.value)];
    }
}

function confirmBooking() {
    var selectedSlot = document.querySelector('.time-slot.selected');
    if (!selectedSlot) {
        alert('Please select a time slot first.');
        return;
    }

    var slotDate = selectedSlot.dataset.date;
    var slotTime = selectedSlot.dataset.time;
    var slotLbl = selectedSlot.dataset.label;

    if (!state.selectedService) {
        alert('Please select a service.');
        return;
    }


    var biz = null;
    for (var i = 0; i < state.businesses.length; i++) {
        if (state.businesses[i].name === state.currentProvider) {
            biz = state.businesses[i];
            break;
        }
    }

    if (biz) {
        biz.appointments.push({
            clientName: state.clientName,
            service: state.selectedService.name,
            slotLabel: slotLbl,
            date: slotDate,
            time: slotTime,
            status: 'waiting'
        });
    }

    state.appointments.push({
        provider: state.currentProvider,
        service: state.selectedService.name,
        duration: state.selectedService.duration,
        date: slotDate,
        time: slotTime
    });

    closeModal();
    navigateTo('live-view');
    startCountdown(slotDate, slotTime);
}
