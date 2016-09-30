function Project(pid,puid,pname,pdataSets){
	this.pid=pid;
	this.pname=pname;
	this.puid=puid;

	this.dataSets=pdataSets;
	console.log('project :',this.dataSets);

	Project.prototype={
		constructor:Project,
		addDataSet:function(ds){
			this.dataset.push(ds);
		}
	}
}