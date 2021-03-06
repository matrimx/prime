$(function() {

    $(document).on('click', '#widgets-shortcodes', function(e) {
        window.open($(e.target).data('externalUrl') + 'cheat-sheet.html', '_blank');
    });


	if($.cookie('hideAdminPanel') == null) {
		$.cookie('hideAdminPanel', 0);
	}

	//seotoaster admin panel cookie
	if($.cookie('hideAdminPanel') && $.cookie('hideAdminPanel') == 1) {
		$('#cpanelul').hide();
		$('#logoutul').hide();
		$('#seotoaster-logowrap').hide();
		$('#showhide > a').text('Expand menu'); //.addClass('rounded-bottom');
	}


	$('#cpanelul').accordion({
        heightStyle: 'content'
	});

	if($.cookie('currSectionOpen')) {
		$('#cpanelul').accordion({active: parseInt($.cookie('currSectionOpen'))});
	}

	$(document).on('click', '#cpanelul li', function() {
		$.cookie('currSectionOpen', $(this).index());
	});



	$('#showhide > a').click(function() {
		$.cookie('hideAdminPanel', ($.cookie('hideAdminPanel') == 1) ? 0 : 1);
		$(this).text(($.cookie('hideAdminPanel') == 1) ? 'Expand menu' : 'Collapse menu'); //.toggleClass('rounded-bottom');
		$('#cpanelul').slideToggle();
		$('#logoutul').toggle();
		$('#seotoaster-logowrap').slideToggle();
	})

	//admin panel edit 404 page click
	$('#edit404').click(function(){
		$.get($('#website_url').val() + 'backend/backend_page/edit404page', function(responseText){
			if(responseText.notFoundUrl) {
				window.location.href = responseText.notFoundUrl;
			}
			else {
				smoke.alert('Sorry, but you don\'t have the 404 error page You can create a page and assign it as 404 error page Use the checkbox on the create/update page screen.', {'classname':'errors'});
			}
		});
	});

	//admin panel delete this page link
	$('#del-this-page').click(function() {
		var pageId     = $('#del-page-id').val();
		var websiteUrl = $('#website_url').val();

		var isCategory = !!($(this).data('cid') == 0);
		if(isCategory) {
			$.getJSON(websiteUrl + 'backend/backend_page/checkforsubpages/pid/' + pageId, function(response) {
				if(response.responseText.subpages) {
					smoke.alert(response.responseText.message, {'classname':'errors'});
					return false;
				} else {
					showDelConfirm();
				}
			});
		} else {
			showDelConfirm();
		}
	})
});

function showDelConfirm() {
	var pageId     = $('#del-page-id').val();
	var websiteUrl = $('#website_url').val();
	smoke.confirm('Are you sure you want to delete this page?', function(e) {
		if(e) {
			$.ajax({
				url        : websiteUrl + 'backend/backend_page/delete/',
				type       : 'post',
				dataType   : 'json',
				data       : {
					id : pageId
				},
				beforeSend : function() {
					smoke.signal('Removing page...', 30000);
				},
				success : function(response) {
					hideSpinner();
					if(!response.error) {
						top.location.href = websiteUrl;
					}
					else {
						smoke.alert(response.responseText.body, {'classname':'errors'});
					}

				}
			})
		}
	}, {'classname':'errors', 'ok':'Yes', 'cancel':'No'});
}
