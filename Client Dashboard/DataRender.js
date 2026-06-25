var state = {
    role: null,
    isSignup: false,
    selectedSector: 'Clinic',
    bufferTime: 10,
    currentProvider: null,
    currentBizIndex:null,
    selectedService:null,
    clientName: 'Guest',
    appointments:[],

    businesses:[
        {
            name:'City Dental',
            sector:'Clinic',
            distance:'1.2 km',
            status:'Open Now',
            location:'14 Nile St, Cairo',
            slots:[
                {date:'2026-05-10', time:'9:00'},
                {date:'2026-05-10', time:'10:30'},
                {date:'2026-05-11', time:'14:00'}
            ],
            services:[
                {name: 'General Checkup', duration: 20},
                {name: 'Deep Cleaning', duration: 45},
                {name: 'X-Ray / Scan', duration: 15}
            ],
            features: {ai: true, pay: true, doc: false, arr: false, dur: true, email: false},
            appointments:[],
            delayActive: false,
            delayMessage: ''
        },
        {
            name: 'Downtown Gym',
            sector: 'Gym',
            distance:'0.5 Km',
            status: 'Open 24/7',
            location: '7 Tahrir Square, Cairo',
            slots:[
                {date: '2026-05-09', time: '06:00' },
                { date: '2026-05-09', time: '08:00' },
                {date: '2026-05-10', time: '18:00'}
            ],
            services:[
                {name: 'Personal Training', duration:60},
                {name: 'Group Class', duration:45},
                {name: 'Open Gym', duration:90}
            ],
            features: {ai: true, pay: true, doc: false, arr: true, dur: true, email: true},
            appointments:[],
            delayActive: false,
            delayMessage: ''
        },
        {
            name:'National Bank',
            sector:'Bank',
            distance:'2.0 Km',
            status:'Closes 5 PM',
            location: '3 Banking District, Cairo',
            slots:[
                {date: '2026-05-12', time: '11:00'},
                {date: '2026-05-12', time: '13:00'},
                {date: '2026-05-13', time: '15:00' }
            ],
            services:[
                {name: 'Account Opening', duration: 30},
                {name: 'Loan Consultation', duration: 45},
                {name: 'General Inquiry', duration: 15}
            ],
            features:{ai: true, pay: false, doc: false, arr: false, dur: true, email: true},
            appointments: [],
            delayActive: false,
            delayMessage: ''
        }
    ]
};

// business setup
function selectSector(el, sector) {
    state.selectedSector = sector;
    var items = document.querySelectorAll('.sector-item');
    for (var i = 0; i < items.length; i++) {
        items[i].classList.remove('active');
    }
    el.classList.add('active');
}

function addSlot() {
    var dateVal = document.getElementById('slot-date').value;
    var timeVal = document.getElementById('slot-time').value;

    if (!dateVal || !timeVal) {
        alert('Please choose both a date and a time.');
        return;
    }

    var label = formatDate(dateVal) + ' · ' + formatTime(timeVal);
    var wrap = document.getElementById('slots-wrap');

    var tag = document.createElement('div');
    tag.className = 'slot-tag';
    tag.dataset.date = dateVal;
    tag.dataset.time = timeVal;
    tag.innerHTML = '<span>' + label + '</span>'
        + '<span class="remove" onclick="this.parentElement.remove()">×</span>';
    wrap.appendChild(tag);

    // Clear inputs
    document.getElementById('slot-date').value = '';
    document.getElementById('slot-time').value = '';
}

function adjustBuffer(val) {
    state.bufferTime = Math.max(0, state.bufferTime + val);
    document.getElementById('buffer-val').textContent = state.bufferTime;
}

function getHostFeatures() {
    return {
        ai: document.getElementById('feat-ai').checked,
        pay: document.getElementById('feat-pay').checked,
        doc: document.getElementById('feat-doc').checked,
        arr: document.getElementById('feat-arr').checked,
        dur: document.getElementById('feat-dur').checked,
        email: document.getElementById('feat-email').checked
    };
}

function publishBusiness() {
    var name = document.getElementById('business-name').value.trim();
    var location = document.getElementById('business-location').value.trim();

    if (!name) {
        alert('Please enter a Business Name.');
        return;
    }

    var slotTags = document.querySelectorAll('#slots-wrap .slot-tag');
    var slots = [];
    for (var i = 0; i < slotTags.length; i++) {
        slots.push({
            date: slotTags[i].dataset.date,
            time: slotTags[i].dataset.time
        });
    }

    if (slots.length === 0) {
        alert('Please add at least one appointment slot.');
        return;
    }

    var newBiz = {
        name: name,
        sector: state.selectedSector,
        distance: location ? '—' : 'New',
        status: 'Open Now',
        location: location || 'Location not set',
        slots: slots,
        services: [
            { name: 'General Appointment', duration: 30 },
            { name: 'Consultation', duration: 20 },
            { name: 'Follow-up', duration: 15 }
        ],
        features: getHostFeatures(),
        appointments: [],
        delayActive: false,
        delayMessage: ''
    };

    state.businesses.push(newBiz);
    state.currentBizIndex = state.businesses.length - 1;

    // Reset the setup form
    document.getElementById('business-name').value = '';
    document.getElementById('business-location').value = '';
    document.getElementById('slots-wrap').innerHTML = '';

    navigateTo('host-manager');
}

//  business manger
function renderManager() {
    var idx = state.currentBizIndex;
    if (idx === null || idx === undefined) return;
    var biz = state.businesses[idx];
    if (!biz) return;

    document.getElementById('bm-name').textContent = biz.name;
    document.getElementById('bm-sector').textContent = biz.sector + ' · ' + biz.location;
    document.getElementById('bm-location').textContent = biz.location;

    var waitingCount = 0;
    for (var i = 0; i < biz.appointments.length; i++) {
        if (biz.appointments[i].status === 'waiting') waitingCount++;
    }
    document.getElementById('bm-total').textContent = biz.appointments.length;
    document.getElementById('bm-waiting').textContent = waitingCount;

    document.getElementById('bm-delay-toggle').checked = biz.delayActive;
    var msgBox = document.getElementById('delay-msg-box');
    if (biz.delayActive) {
        msgBox.classList.add('visible');
    } else {
        msgBox.classList.remove('visible');
    }

    renderSlotOverview(biz);
    renderQueue(biz);
}

function renderSlotOverview(biz) {
    var container = document.getElementById('bm-slots');
    container.innerHTML = '';

    for (var i = 0; i < biz.slots.length; i++) {
        var slot = biz.slots[i];
        var label = slotLabel(slot);

        var booked = 0;
        for (var j = 0; j < biz.appointments.length; j++) {
            if (biz.appointments[j].slotLabel === label) booked++;
        }

        var row = document.createElement('div');
        row.className = 'slot-overview-row';
        row.innerHTML = '<span>' + label + '</span>'
            + '<span class="slot-booked-count">' + booked + ' booked</span>';
        container.appendChild(row);
    }
}

function renderQueue(biz) {
    var container = document.getElementById('bm-queue');
    container.innerHTML = '';

    if (biz.appointments.length === 0) {
        container.innerHTML = '<p class="empty-msg">No bookings yet.</p>';
        return;
    }

    var bizIdx = state.currentBizIndex;

    for (var i = 0; i < biz.appointments.length; i++) {
        var apt = biz.appointments[i];
        var item = document.createElement('div');
        item.className = 'queue-item';

        var actionBtns = '';
        if (apt.status === 'waiting') {
            actionBtns = '<button class="btn-small" onclick="startSession(' + bizIdx + ',' + i + ')">Start</button>'
                + '<button class="btn-remove" onclick="removeBooking(' + bizIdx + ',' + i + ')">✕</button>';
        } else if (apt.status === 'in-session') {
            actionBtns = '<button class="btn-small" onclick="finishSession(' + bizIdx + ',' + i + ')">Done ✓</button>';
        }

        item.innerHTML = '<span class="q-pos">#' + (i + 1) + '</span>'
            + '<div class="q-info">'
            + '<strong>' + apt.clientName + '</strong>'
            + '<span>' + apt.service + '</span>'
            + '<span>' + apt.slotLabel + '</span>'
            + '</div>'
            + '<div class="q-actions">'
            + '<span class="badge ' + apt.status + '">' + apt.status.replace('-', ' ') + '</span>'
            + actionBtns
            + '</div>';

        container.appendChild(item);
    }
}

function startSession(bizIdx, aptIdx) {
    state.businesses[bizIdx].appointments[aptIdx].status = 'in-session';
    renderManager();
}

function finishSession(bizIdx, aptIdx) {
    state.businesses[bizIdx].appointments[aptIdx].status = 'done';
    renderManager();
}

function removeBooking(bizIdx, aptIdx) {
    state.businesses[bizIdx].appointments.splice(aptIdx, 1);
    renderManager();
}

function toggleDelay() {
    var biz = state.businesses[state.currentBizIndex];
    biz.delayActive = document.getElementById('bm-delay-toggle').checked;
    var msgBox = document.getElementById('delay-msg-box');
    if (biz.delayActive) {
        msgBox.classList.add('visible');
    } else {
        msgBox.classList.remove('visible');
    }
}

function sendDelay() {
    var biz = state.businesses[state.currentBizIndex];
    biz.delayMessage = document.getElementById('delay-msg-input').value.trim();
    if (biz.delayMessage) {
        alert('Delay notification sent to all clients:\n"' + biz.delayMessage + '"');
    } else {
        alert('Delays cleared. Clients have been notified.');
    }
}

function sendEarlyBlast() {
    alert('📢 In-transit clients have been notified to arrive early!');
}

//client booking
var SECTOR_ICONS = { Clinic: '🏥', Bank: '🏦', Gym: '💪', Salon: '✂️', Other: '🏪' };

function renderCategoryGrid() {
    var grid = document.getElementById('category-grid');
    grid.innerHTML = '';

    var sectors = [];
    for (var i = 0; i < state.businesses.length; i++) {
        var s = state.businesses[i].sector;
        if (sectors.indexOf(s) === -1) {
            sectors.push(s);
        }
    }

    for (var j = 0; j < sectors.length; j++) {
        var sector = sectors[j];
        var icon = SECTOR_ICONS[sector] || '🏪';
        var btn = document.createElement('button');
        btn.className = 'category-btn';
        btn.innerHTML = '<span class="cat-icon">' + icon + '</span><span>' + sector + '</span>';

        (function (sec) {
            btn.onclick = function () { openProviders(sec); };
        })(sector);

        grid.appendChild(btn);
    }
}

function renderCalendar() {
    var container = document.getElementById('calendar-list');
    container.innerHTML = '';

    if (state.appointments.length === 0) {
        container.innerHTML = '<p class="calendar-empty">No appointments yet. Book one above!</p>';
        return;
    }

    var sorted = state.appointments.slice().sort(function (a, b) {
        if (a.date !== b.date) return a.date > b.date ? 1 : -1;
        return a.time > b.time ? 1 : -1;
    });

    for (var i = 0; i < sorted.length; i++) {
        var apt = sorted[i];
        var row = document.createElement('div');
        row.className = 'appointment-row';

        row.innerHTML =
            '<div class="date-box">'
            + '<span class="day">' + getDayNum(apt.date) + '</span>'
            + '<span class="month">' + getMonthStr(apt.date) + '</span>'
            + '</div>'
            + '<div class="apt-info">'
            + '<h5>' + apt.provider + '</h5>'
            + '<p>' + apt.service + ' · ' + apt.duration + 'm</p>'
            + '<p class="apt-time">🕐 ' + formatDate(apt.date) + ' at ' + formatTime(apt.time) + '</p>'
            + '</div>'
            + '<button class="btn-live" onclick="goLive(\'' + apt.provider + '\',\'' + apt.date + '\',\'' + apt.time + '\')">Live</button>';

        container.appendChild(row);
    }
}

function goLive(provider, date, time) {
    state.currentProvider = provider;
    navigateTo('live-view');
    startCountdown(date, time);
}
function openProviders(sector) {
    renderProviders(sector);
    navigateTo('provider-view');
}

function renderProviders(sector) {
    var container = document.getElementById('provider-list');
    container.innerHTML = '';

    var filtered = [];
    for (var i = 0; i < state.businesses.length; i++) {
        if (state.businesses[i].sector === sector) {
            filtered.push(state.businesses[i]);
        }
    }

    if (filtered.length === 0) {
        container.innerHTML = '<p class="empty-msg">No providers in this category yet.</p>';
        return;
    }

    for (var j = 0; j < filtered.length; j++) {
        var biz = filtered[j];
        var card = document.createElement('div');
        card.className = 'card provider-item';

        var delayHtml = '';
        if (biz.delayActive && biz.delayMessage) {
            delayHtml = '<div class="delay-banner">⚠️ Delay: ' + biz.delayMessage + '</div>';
        }

        card.innerHTML = delayHtml
            + '<div class="provider-info">'
            + '<h4>' + biz.name + '</h4>'
            + '<p>' + biz.distance + ' away · ' + biz.status + '</p>'
            + '<p>📍 ' + biz.location + '</p>'
            + '</div>'
            + '<button class="btn-small" style="flex-shrink:0;" onclick="openModal(\'' + biz.name.replace(/'/g, "\\'") + '\')">Book</button>';

        container.appendChild(card);
    }
}

function updateBuffer() {
    var val = document.getElementById('transit-slider').value;
    document.getElementById('buffer-display').textContent = val + 'm';
    var msg = document.getElementById('traffic-msg');
    if (val > 20) {
        msg.textContent = 'Heavy traffic detected. Large buffer set — leave now!';
    } else {
        msg.textContent = 'Moderate traffic. Syncing with maps data...';
    }
}

function setMode(mode) {
    document.getElementById('mode-drive').classList.remove('active');
    document.getElementById('mode-walk').classList.remove('active');
    if (mode === 'driving') {
        document.getElementById('mode-drive').classList.add('active');
    } else {
        document.getElementById('mode-walk').classList.add('active');
    }
}

function reportLate() {
    var provider = state.currentProvider || 'your provider';
    alert('Host (' + provider + ') has been notified you are running late!');
}

function checkIn() {
    document.getElementById('step-transit').classList.remove('active');
    document.getElementById('step-transit').classList.add('done');
    document.getElementById('step-lobby').classList.add('active');
    alert('✅ Geofence confirmed! You are within 50m. Welcome!');
}