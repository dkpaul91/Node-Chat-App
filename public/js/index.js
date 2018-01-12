var socket = io();

var updateActiveRoomList = function () {
    jQuery.ajax({
        url: window.location.href + "getRooms",
        success: function (data) {
            jQuery('#rooms').html('');
            if (data.activeRooms.length > 0) {
                data.activeRooms.forEach(function (room) {
                    var roomVal = jQuery('<option />');
                    roomVal.attr('value', room);
                    jQuery('#rooms').append(roomVal);
                });
            }
        }
    });
}
updateActiveRoomList();
socket.on('newConnection', updateActiveRoomList);
