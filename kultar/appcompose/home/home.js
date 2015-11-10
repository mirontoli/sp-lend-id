(function($, undefined){
  'use strict';

  // The initialize function must be run each time a new page is loaded
  Office.initialize = function(reason){
    jQuery(document).ready(function(){
      app.initialize();

      /*jQuery('#set-subject').click(setSubject);
      jQuery('#get-subject').click(getSubject);
      jQuery('#add-to-recipients').click(addToRecipients);
      */
      $('#insert-a-joke').on("click", insertJoke);
    });
  };
  function insertJoke() {
    console.log("tolle1");
    var xhr = jQuery.getJSON("https://api.icndb.com/jokes/random");
    xhr.done(function(data) {
      console.log("tolle", data);
      var html = ['<hr><p style="font-size:2rem;">Random Joke</p>', '<p style="font-size:1.5rem;">', data.value.joke, '</p><hr>'].join('');
      Office.context.mailbox.item.body.setSelectedDataAsync(html, { coercionType: Office.CoercionType.Html});
    });
  }
  function setSubject(){
    console.log("tolle1");
    var xhr = jQuery.getJSON("https://api.icndb.com/jokes/random");
    xhr.done(function(data) {
      console.log("tolle", data);
      var html = ['<hr><p style="font-size:2rem;">Random Joke</p>', '<p style="font-size:1.5rem;">', data.value.joke, '</p><hr>'].join('');
      Office.context.mailbox.item.body.setSelectedDataAsync(html, { coercionType: Office.CoercionType.Html});
    });
    
    //Office.cast.item.toItemCompose(Office.context.mailbox.item).subject.setAsync('Hello world!');
  }

  function getSubject(){
    Office.cast.item.toItemCompose(Office.context.mailbox.item).subject.getAsync(function(result){
      app.showNotification('The current subject is', result.value);
    });
  }

  function addToRecipients(){
    var item = Office.context.mailbox.item;
    var addressToAdd = {
      displayName: Office.context.mailbox.userProfile.displayName,
      emailAddress: Office.context.mailbox.userProfile.emailAddress
    };

    if (item.itemType === Office.MailboxEnums.ItemType.Message) {
      Office.cast.item.toMessageCompose(item).to.addAsync([addressToAdd]);
    } else if (item.itemType === Office.MailboxEnums.ItemType.Appointment) {
      Office.cast.item.toAppointmentCompose(item).requiredAttendees.addAsync([addressToAdd]);
    }
  }

})(jQuery);
