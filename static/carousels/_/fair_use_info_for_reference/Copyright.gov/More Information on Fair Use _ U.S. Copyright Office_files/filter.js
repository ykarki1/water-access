function filterTable(){
	 var rex = new RegExp($("#filter").val(), 'i');
	 $(document).ready(function () {
		$('tbody tr').hide();
		$('tbody tr').filter(function () {
			return rex.test($(this).text());
		}).show();
	 });
}
function filterTableWithTabs(){
	 var rex = new RegExp($("#filter").val(), 'i');
	 $(document).ready(function () {
		 //checks for matching table rows. hides non matching ones.
		$('tbody tr').hide();
		$('tbody tr').filter(function () {
			return rex.test($(this).text());
		}).show();
		
		//checks which tabs have any matching entries in their tables. hide the ones that don't
		$("ul.nav.nav-tabs li").hide();
		$("ul.nav.nav-tabs li").filter(function (index) {
			var any_visible=false;
			$("#tab"+(index+1)+" table tbody tr").each(function(){
				if(rex.test($(this).text())){
					any_visible=true;
				}
				return;
			});
			return any_visible;
		}).show();
		
		//checks if any visible tabs are active. If not, sets the first visible tab to active
		var none_active = true;
		$("ul.nav.nav-tabs li.active").each(function(){
			if($(this).is(":hidden")){
				$(this).removeAttr("class");
			}else{
				none_active = false;
			}
			return;
		});
		if(none_active){
			$("ul.nav.nav-tabs li:visible :first").click();
		}
	 });
}
