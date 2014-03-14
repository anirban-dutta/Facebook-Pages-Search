var getCategoriesUrl = "https://graph.facebook.com/search?q=%{search}&type=page&access_token=%{access_token}&limit=%{limit}";
var pageOpenUrl = "https://www.facebook.com/pages/OpenID/%{page_id}";
var accessToken = "254217074756643|0XzEWZLyNOZtYCgdnehEOCEax0s";
var sampleUi = document.getElementById("sampleUi");
var holder = document.getElementById("pagesContainer");
var loadMoreUrl = "";
var limit = 100;
var jsonp = new function(){
	const _blankFn = function(){};
	var onSuccess = _blankFn;
	var timeoutObj;
	const _timeoutTime = 60000;//MILISEC - 60 Secs
	this.send = function(url,callback){
		if(!url) return false;
		try{
			onSuccess = callback || onSuccess;
			if(timeoutObj) clearTimeout(timeoutObj);
			timeoutObj = setTimeout(function(){
				onTimeout();
			},_timeoutTime);
			var seperator = "?";
			if(url.indexOf("?")>0){
				seperator = "&";
			}
			var src = url+seperator+"callback=jsonp.callback";
			var script = document.createElement("script");
			script.type = "text/javascript";
			script.async = true;
			script.src = src;
			var head = document.getElementsByTagName("head")[0];
			head.appendChild(script);		
			return true;
		}catch(err){
			console.error(err);
			return false;
		}
	};
	this.callback = function(data){
		if(timeoutObj) clearTimeout(timeoutObj);
		onSuccess(true,data);
		onSuccess = _blankFn;
	};
	var onTimeout = function(){
		onSuccess(false);
		onSuccess = _blankFn;
	};
};
var showLoading = function(show){
	var loading = document.getElementById("loadingIcon");
	if(show){
		loading.style.display = "table";
	}else{
		loading.style.display = "none";
	}
};
function onCategoriesData(stat,resp){
	showLoading(false);
	if(!stat || !resp || !resp.data || resp.data.length==0){
		alert("No Data Found");
		return;
	};
	var data = resp.data;
	
	var pageHolder = sampleUi.children[0];
	for(var i=0;i<data.length;i++){
		var page = pageHolder.cloneNode(true);
		var cat = data[i];
		var pageName = page.getElementsByClassName("pageName")[0];
		pageName.innerHTML = cat.name;
		pageName.setAttribute("href",pageOpenUrl.replace("%{page_id}",cat.id));
		pageName.setAttribute("title",cat.name);
		page.getElementsByClassName("pageCategory")[0].innerHTML = cat.category;
		holder.appendChild(page);
	}
	var loadMore = document.getElementById("loadMore");
	if(loadMore){
		loadMore.remove();
	}
	if(resp.paging && resp.paging.next){
		loadMoreUrl = resp.paging.next;
		loadMore = document.createElement("div");
		loadMore.setAttribute("id","loadMore");
		loadMore.innerHTML = "Load More";
		holder.appendChild(loadMore);
		onClick(loadMore,loadMoreFn);
	}
};
function getCategories(search){
	search = search || "platform";
	var url = getCategoriesUrl;
	url = url.replace("%{search}",search);
	url = url.replace("%{access_token}",accessToken);
	url = url.replace("%{limit}",limit);
	holder.innerHTML = "";
	showLoading(true);
	jsonp.send(url,onCategoriesData);
};
function loadMoreFn(){
	showLoading(true);
	jsonp.send(loadMoreUrl,onCategoriesData);
};
function onSearch(){
	var searchInput = document.getElementById("inputFbCategory");
	var val = searchInput.value;
	if(val){
		getCategories(val);
	}else{
		alert("Please enter some text to search!");
		searchInput.focus();
	}
};
function onClick(elem,fn){
	if(elem.addEventListener){
		elem.addEventListener('click',fn,false);
	}else if(elem.attachEvent){
		elem.attachEvent('onclick',fn);
	}else{
		elem.onclick = fn;
	}

};
function init(){
	var searchBtn = document.getElementById("doSearch");
	onClick(searchBtn,onSearch);
};
