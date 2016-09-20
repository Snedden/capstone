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


//toggle view data columns
$(document).on('click','.dataset',function(){
  $(this).find('li').toggle();
});

//dataset modle open
//triggered when modal is about to be shown
$('#datasetModal').on('show.bs.modal', function(e) {
    $("#dataSetColsList").empty(); //clear previous
    //get data-id attribute of the clicked element
    var datasetId = $(e.relatedTarget).data('dataset-id');
    var datasetName = $(e.relatedTarget).data('dataset-name');
    var pid = $(e.relatedTarget).data('project-id');

    //populate the textbox
    $(e.currentTarget).find('#datasetName').html(datasetName);
    $(e.currentTarget).find('#deleteDatasetBtn').attr('data-id',datasetId);
    $(e.currentTarget).find('#deleteDatasetBtn').attr('data-pid',pid);


    ajaxCall('get','dataset/columns/'+datasetId,null,'json',datasetColumnCallback); 
});

function datasetColumnCallback(data){

  for (col in data){

    $("#dataSetColsList").append('<li>'+
                                    '<input type="text" id="col_name" placeholder="columnname" value="'+data[col].col_name+'"></input>'+ 
                                    '<select >'+
                                      '<option value="String" '+isString(data[col].col_type)+'>String</option>'+
                                      '<option value="Number" '+isNumber(data[col].col_type)+'>Number</option>'+
                                    '</select>'+
                                    '<input type="hidden" id="col_id" placeholder="columnname" value="'+data[col].col_Id+'"></input>'+ 
                                    '</li>');

  }

  //functions to see if its type number or string in dataset columns
  function isString(type){
    if(type=="String")
    {
      return 'selected';
    }
    
  }
  function isNumber(type){
    if(type=="Number"){
      return 'selected';
    }
    
  }
}

//Update dataset column button clicked
$(document).on('click','#updateDatasetBtn',function(){
  var dataCols=[];

  $("#dataSetColsList li").each(function(index){
    console.log($(this).find('#col_name').val());
    var col={
      col_name:$(this).find('#col_name').val(),
      col_type:$(this).find('select').val(),
      col_id:$(this).find('#col_id').val()

    };
    
    dataCols.push(col);
  });  

  //update in database
  ajaxCall('post','datasetColumns/update',dataCols,'text',datasetColumnUpdateCallback); 
});

function datasetColumnUpdateCallback(data){
  console.log(data);
}





//delete dataset button click
$(document).on('click','#deleteDatasetBtn',function(){
  console.log($(this).attr('data-id'));
  var postData={
    iddata_sets:$(this).attr('data-id'),
    pid:$(this).attr('data-pid')
  };
  console.log(postData);
  ajaxCall('post','dataset/delete',postData,'text',deleteDataSetCallBack); 
});

function deleteDataSetCallBack(data){
  
  location.reload();
}


