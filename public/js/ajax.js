 
/*
**Desc: Ajax call wrapper
*@args-type: json,text,html etc
*@args-url: calling url
*@args-submitData: postData
*@args-dataType:json,text etc
*@args-succesCallback: callback on success
*@args-notGlobal-set to true to avoid ajaxstart event for loader overlay
*/ 
function ajaxCall(type,url,submitData,dataType,successCallBack,notGlobal){
    //console.log(submitData);
    var globalCall=true;
    if(notGlobal){
        globalCall=false;
    }
    $.ajaxSetup({
        headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
    });
    $.ajax({

            type: type,
            //url: window.location.origin+'/projectFirst/public/'+url,
            url: window.location.origin+'/'+url,
            data:{data:submitData},
            dataType: dataType,
            global:globalCall,
        
            success: function (data) {
                //console.log(data);
                successCallBack(data);

            },
            error: function (data) {
                console.error('Error:', data);
            }
        });
}

function test(animal){
    var animalType = animal.getAttribute("data-animal-type");
    alert("The " + animal.innerHTML + " is a " + animalType + ".");  
}

 