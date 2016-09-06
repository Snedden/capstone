 
function ajaxCall(type,url,submitData){
    $.ajax({

            type: type,
            url: url,
            data: submitData,
            dataType: 'HTML',
            success: function (data) {
                console.log(data);

            },
            error: function (data) {
                console.log('Error:', data);
            }
        });
}

function test(animal){
    var animalType = animal.getAttribute("data-animal-type");
    alert("The " + animal.innerHTML + " is a " + animalType + ".");  
}

 