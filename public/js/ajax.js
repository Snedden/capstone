 
function ajaxCall(type,url,submitData,dataType,successCallBack){
    //console.log(submitData);

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

 