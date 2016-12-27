function Helpers(sessionStorageVar,modalId,gotItBtnId){

	this.sessionStorageVar = sessionStorageVar;
	this.modalId    	   = modalId;
	this.gotItBtnId 	   = gotItBtnId;
	this.gotIt             = false;  //got it is false by default since got it button is not clicked
	this.helperOnScreen    = window.sessionStorage.getItem('helperOnScreen')=="true"?true:false; //turns true when we have a helper on screen ; 
	this.doNotShowHelper   = window.sessionStorage.getItem('turnOffHelper')=="true"?true:false; //turns true when user checks do not show helper ; 
	this.GotItClicked      = window.sessionStorage.getItem(this.sessionStorageVar); //'Got it' was clicked in this 

	this.setGotItClickEvent();
	
	this.setHelperCloseEvent();

	//show helper if got it was not clicked and there are now helpers on the screen and do not show helper was not checked
	if((this.GotItClicked == null) && (!this.helperOnScreen) && (!this.doNotShowHelper )){
		this.setHelper();
	}

	
}

Helpers.prototype={
	setHelper:function(){
		//Add  helper modal 
		$('#'+this.modalId).modal('show');
		//there is a helper on screen
	    window.sessionStorage.setItem('helperOnScreen',true);  
	},
	setGotItClickEvent:function(){
		    var self=this;
			$("#"+this.gotItBtnId).click(function(){
		      self.gotIt=true;
		      window.sessionStorage.setItem(self.sessionStorageVar, self.gotIt); 
		  });
	},
	setHelperCloseEvent: function(){
		$("#"+this.modalId).on('hidden.bs.modal', function () {
			window.sessionStorage.setItem('helperOnScreen',false);

			//set session variable if check box is checked
			if($('.doNotShowHelperCheckbox').prop('checked')){
				window.sessionStorage.setItem('turnOffHelper',true)
			}

		})
	}
}