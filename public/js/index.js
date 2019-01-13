var socket = io();
socket.on('connect', function(){
    console.log('connected to sever');

    // var Username = $('.form').find('input[name="Username"]').val();
    // var room = $('.form').find('input[name="Room"]').val();
    // console.log(Username);
    // console.log(room);

    // $('.form').submit( function(event){
    //     console.log('submit clicked');
    // });

    // var input = {
    //    name: name,
    //    room: room
    // };
     
    // console.log(input);

    // socket.emit('getInputs', input );
  
});

// jQuery('.form').on('submit',function(e){
//     e.preventDefault();
    
//     socket.emit('newMessage',{
//         from:'User',
//         text: jQuery('[name=Username]').val()
//     });
// });

jQuery('#messages__chat').on('submit',function(e){
    e.preventDefault();
    socket.emit('newMessage',{
        from:'User',
        text: jQuery('[name=textbox]').val()
    });
});

socket.on('newMessage', function(data){
    var template = jQuery("#message-template").html();
    var html = Mustache.render(template,{
        from: data.from,
        text: data.text
    });

    // var li = jQuery('<li></li>');
    // li.text(`${data.from}: ${data.text}`);
    jQuery("#messages").append(html);
   console.log('new message arrived', data);

}, function(msg){
    console.log('Acknowlegement received: ',msg);
})

socket.on('disconnect',function() {
    console.log('disconnected from sever');
});

