var clickedUserLi;

function filterNames() {
    var input, filter, ul, li, a, i;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    ul = document.getElementsByClassName("usersUL")[0];
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";

        }
    }
}

//add to shared users from userslist
$(document).on('click', '#userList li', function() { 
  clickedUserLi=$(this);
  var  sharedProjects=[]; 
  var pid=$( this ).find('a').attr('data-project-id');
  var uid=$( this ).find('a').attr('data-user-id');
  
  sharedProjects.push({
      userid:uid,
      projectId:pid
  });

  ajaxCall('POST','projects/shareProject',sharedProjects,'text',shareUserCallBack); 

});
//add to shared users from userslist call back
function shareUserCallBack(data){
  console.log('shareUser call back ',data);
  $("#sharedUsers ul").append('<li title="Remove user">' + clickedUserLi.html() + '</li>');
  //add to users list from shared users
  clickedUserLi.remove();
}


//remove from shared user list
$(document).on('click', '#sharedUsers li', function() {    
  clickedUserLi=$(this);
  var  unSharedProjects=[]; 
  var pid=$( this ).find('a').attr('data-project-id');
  var uid=$( this ).find('a').attr('data-user-id');
 
  unSharedProjects.push({
      userid:uid,
      projectId:pid
  });

  ajaxCall('post','projects/unshareProject',unSharedProjects,'text',unShareUserCallBack); 

});
//remove from shared user list call back
function unShareUserCallBack(data){
  console.log('unShareUser call back ',data);
  $("#userList ul").append('<li title="Remove user">' + clickedUserLi.html() + '</li>');
 
  clickedUserLi.remove();
}






/*$('#myModal').on('hidden.bs.modal', function () {
   window.location.reload();
});*/