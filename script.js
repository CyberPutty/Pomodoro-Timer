var $timer = $('#setTime');// main timer
var $interval = $('#interval');// interval timer
var $break = $('#breakTime');//break timer
var $currentTask = $('#currentTask');//currentList
var $removeCurr = $('#removeCurr');//remove from currentTask
var $removeTask = $('#removeTask');// remove from taskList
var minutes = 0;
var seconds = 0;
var interval = 25;
var breakInt = 5;
var toggle;// switch for setInterval
var breakState = false;// switch for break
var task = 'None';// text for current status
var stopWatch = false;// switch for main timer
var alarm = document.getElementById('alarm');// alarm link
var listItem = document.getElementsByClassName('assigned');// assigned to current task
var taskVal;// no idea
var idList = 0;// IdGenerator for clone
/// initalize time with standard 25 min pomodoro;
$currentTask.text(task);
$interval.text(interval + ':00');
minutes = interval;
$break.text(breakInt + ':00');
zeroAdd();

function zeroAdd()// adds leading zero to timer
{
    if (seconds < 10) {
        $timer.text(minutes + ':' + '0' + seconds);
    }

    else {
        $timer.text(minutes + ':' + seconds);
    }
}

// Disp up runs the timer
function DispUp() {
    zeroAdd();
    if (seconds + minutes > 0 && breakInt > 0) {
        if (seconds > 0) {
            seconds--;
        }
        else {
            minutes--;
            seconds = 59;
        }

    }

    if (seconds + minutes === 0 && interval > 0 && breakInt > 0) {
        var alarm = document.getElementById('alarm');
        alarm.volume = 0.3;
        alarm.play();
        if (breakState === false) {
            if (listItem.length) {
                listItem[0].className = 'entry complete';
            }
            minutes = breakInt;
            breakState = true;

            task = 'Break';
            $currentTask.text(task);
        }
        else {

            minutes = interval;
            breakState = false;
            if (listItem.length) {
                task = listItem[0].innerText;
                $currentTask.text(task);
            }
            else {
                task = 'None';
                $currentTask.text(task);
            }
        }

    }
}
// interval function
function UpdateTime() {
    toggle = window.setInterval('DispUp()', 1000);
    stopWatch = true;

}
// Main Timer
$('.timer').on('click', function () {
    if (minutes + seconds !== 0 && breakInt !== 0 && stopWatch === false) {

        if (listItem.length && breakState === false) {
            task = listItem[0].innerText;
            $currentTask.text(task);
        }

        if (!listItem.length && breakState === false) {
            task = 'None';
            $currentTask.text(task);
        }
        if (breakState === true) {
            task = 'Break';
            $currentTask.text(task);
        }

        $(this).css("background-color", 'rgb(178, 34, 34)');
        UpdateTime();
    }
    else if (stopWatch === true) {

        $(this).css("background-color", 'rgb(50, 205, 50)');

        window.clearInterval(toggle);
        stopWatch = false;
    }



});

// interval timer
$('#interval-minus').on('click', function () {

    if (interval > 0 && stopWatch === false) {
        interval--;
        $interval.text(interval + ':00');
        if (breakState === false) {
            minutes = interval;
            seconds = 0;
            zeroAdd();
        }


    }
});

$('#interval-plus').on('click', function () {
    if (interval < 60 && stopWatch === false) {
        interval++;
        $interval.text(interval + ':00');
        if (breakState === false) {
            minutes = interval;
            seconds = 0;
            zeroAdd();
        }
    }
});

// break timer
$('#break-plus').on('click', function () {
    if (breakInt < 60 && stopWatch === false) {
        breakInt++;
        $break.text(breakInt + ':00');
    }
});


$('#break-minus').on('click', function () {
    if (breakInt > 0 && stopWatch === false) {
        breakInt--;
        $break.text(breakInt + ':00');
    }
});

// reset timer
$('#reset').on('click', function (e) {
    e.preventDefault();
    minutes = interval;
    seconds = 0;
    zeroAdd();
    $('.timer').css("background-color", 'rgb(50, 205, 50)');
    window.clearInterval(toggle);
    stopWatch = false;
    breakState = false;



});

// end of timer block
// start task block
var $addTask = $('#addTask');// + sign
var $form = $('#taskForm');// form 
var $entry = $('.entry');// li items
$form.hide();
// removing items code
$removeCurr.on('click', function () {
    if (stopWatch === false) {
        $(this).parent().find('.entry').last().remove();

    }

});
$removeTask.on('click', function () {
    if (stopWatch === false) {
        $(this).parent().parent().find('.entry').last().remove();
    }

});
// adding items code
$addTask.on('click', function () {
    if (stopWatch === false) {
        $(this).siblings().addBack().not('.entry').hide();
        $form.show();
    }

});
$form.on('submit', function (e) {
    e.preventDefault();
    if ($('input').val() !== '') {
        $addTask.before('<li class="entry cursor" id="n' + idList + '" draggable="true" ondragstart="drag(event)" >' + $('input').val() + '</li>');
        idList++;
    }
    $(this).hide();
    $addTask.siblings().addBack().not('.entry').show();
});

// drag and drop functions
function allowDrop(ev) {
    ev.preventDefault();

}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function onDrop(ev) {
    ev.preventDefault();
    if (!ev.target.id && stopWatch === false) {
        ev.preventDefault();
        var data = ev.dataTransfer.getData("text");
        var clone = document.getElementById(data).cloneNode(true);
        clone.id = "n" + idList;
        idList++;
        clone.className = "entry assigned";
        clone.removeAttribute("draggable");
        ev.target.appendChild(clone);
        ev.target.appendChild(document.getElementById('removeCurr'));
    }
}