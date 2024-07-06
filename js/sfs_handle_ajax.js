var sfs_ajax_who = '';

function sfs_ajax_process(sip, contx, sfunc, url, email = '') {
	sfs_ajax_who = contx;
	var data = {
		action: 'sfs_process',
		ip: sip,
		email: email,
		cont: contx,
		func: sfunc,
		ajax_url: url
	};
	jQuery.get(ajaxurl, data, sfs_ajax_return_process);
}

function sfs_ajax_return_process(response) {
	var el = '';
	if (response == "OK") {
		return false;
	}
	if (response.substring(0, 3) == "err") {
		alert(response);
		return false;
	}
	if (response.substring(0, 4) == "\r\n\r\n") {
		alert(response);
		return false;
	}
	if (sfs_ajax_who != "") {
		var el = document.getElementById(sfs_ajax_who);
		el.innerHTML = response;
	}
	return false;
}

function sfs_ajax_report_spam(t, id, blog, url, email, ip, user) {
	sfs_ajax_who = t;
	var data = {
		action: 'sfs_sub',
		blog_id: blog,
		comment_id: id,
		ajax_url: url,
		email: email,
		ip: ip,
		user: user
	};
	jQuery.get(ajaxurl, data, sfs_ajax_return_spam);
}

function sfs_ajax_return_spam(response) {
	sfs_ajax_who.innerHTML = " Spam Reported";
	sfs_ajax_who.style.color = "green";
	sfs_ajax_who.style.fontWeight = "bolder";
	if (response.indexOf('data submitted successfully') > 0) {
		return false;
	}
	if (response.indexOf('recent duplicate entry') > 0) {
		sfs_ajax_who.innerHTML = " Spam Already Reported";
		sfs_ajax_who.style.color = "yellow";
		sfs_ajax_who.style.fontWeight = "bolder";
		return false;
	}
	sfs_ajax_who.innerHTML = " Status: " + response;
	sfs_ajax_who.style.color = "black";
	sfs_ajax_who.style.fontWeight = "bolder";
	alert(response);
	return false;
}

jQuery(function($) {
	$('.ds-hide-notice').on('click', function() {
		if ($(this).data('target') == 'user') {
			$(this).parent().parent().hide();
			var data = {
				action: 'ds_update_notice_preference',
				notice_id: $(this).data('notice-id')
			};
			$.post(ajaxurl, data);
		}
	});
	$('#ds-disable-admin-emails').on('click', function() {
		if (this.checked) {
			$('.ds-disable-admin-emails-wraps').show()
		} else {
			$('.ds-disable-admin-emails-wraps').hide()
		}
	});
	$('#ds-hide-admin-notices').on('click', function() {
		if (this.checked) {
			$('.ds-reset-hidden-notice-wrap').hide()
		} else {
			$('.ds-reset-hidden-notice-wrap').show()
		}
	});
	$('.ds-action').on('click', function() {
		var data = {
			action: 'ds_allow_block_ip',
			type: $(this).data('type'),
			ip: $(this).data('ip')
		};
		$.post(ajaxurl, data).then(data => {
			alert('Successfully Added')
		});
	});
	$('.ds-action').click(function(){
		$(this).hide();
		$(this).next().hide();
	});
	function checkFormStatus() {
		if ($('#chkform').is(':checked')){
			$('#chkwooform').attr("disabled",true);
			$('#chkgvform').attr("disabled",true);
			$('#chkwpform').attr("disabled",true);
		}
		else {
			$('#chkwooform').attr("disabled",false);
			$('#chkgvform').attr("disabled",false);	
			$('#chkwpform').attr("disabled",false);	
		}
	}
	$('#chkform').change(function(){
		if ($('#chkform').data('status') == 'valid'){
			checkFormStatus();
		}
	});
});
