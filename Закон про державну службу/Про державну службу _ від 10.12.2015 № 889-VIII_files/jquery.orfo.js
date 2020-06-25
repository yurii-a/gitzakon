// �������� ���������
var Orfo = {
	contlen:	100,
	maxlen:		400,
	seltag1:	"<u>",
	seltag2:	"</u>",
	zindex:		10000,
	nostat:		0,
	lang:		'uk',
	url:		"/laws/orfo",
	// Ukrainian (����������) - 'uk', win-1251 encoding
	lng: {
		// ��������� ��� confrim
		alt:		"���� �� �������� ������� � �����, ������ �� ������ �� �������� Ctrl-Enter. ������ �����!",
		badbrowser:	"��� ������� �� ������� ������� �������� �������!",
		toobig:		"�� ��������� ������� ������� ����� ������!",
		subject:	"������������ �������",
		docmsg:		"������ �������",
		thanks:		"����������� ����������. ������ �� ��������!",
		error:		"������� ������� ��� �������� ������!",
		// ��������� ��� css
		title:		"��������� ��� �������",
		header:		"����� � ��������, ������ � �������:",
		comment:	"���������� ��� ������� (�� ����`������):",
		name:		"���� ��'�:",
		email:		"��� e-mail:",
		send:		"³��������",
		cancel:		"³���������",
		close:		"�������",
		// ������� ��-��������� � #orfo_cont = (contkey+contlen+contnam).replace("{contlen}", contlen)
		contkey:	"��� ����, ��� ��� �'������ <u>����� �������</u>, ������ ���� ������ �� �������� <em class=\"nowrap\">Ctrl-Enter</em>.",
		contlen:	"������������ ����� ������� ����� &mdash; �� ����� <strong>{contlen}</strong> �������.",
		conttxt:	"����� �� ��� ������� ����� ��� ����� ������, � ������� ������� �� ���������� ������ ��������� � ��� �����.",
		contnam:	"����� ����� ������� ��� ��'� �� e-mail, ��� ����������� ��� �������� ��������� �������."
	}
};

// ����� �������������� Orfo:
// $(document).ready(function(){
//	$.initOrfo({settings})
// });

// �������� ������ �������:
// orfoSourceType: 'dynamic', 'confrim'
// - dynamic (��������� <div id="+id+">...</div> � ����������) - �� ���������!
//   ����� �������� ������� ����� � ���� � ��������� orfoSourceID
// - confrim (������ �� ���������, �������� ����� ��������� ���������)

// ����� ������� ��� ��������������� (���� ���� ������������� = dynamic)
// orfoComment: 'none', 'comm', 'email', 'full'
// - none (������ ��������� ��, ��� ��������, ��� ���� �� � ������ dynamic)
// - comm (���� �������������� ��������� �����������)
// - email (������ ������������ - ��� � e-mail �����)
// - full (comm + email)

(function($){
	var get_cont = function() {
		with (Orfo.settings) with (Orfo.lng) {
			var result = contkey + " " +contlen.replace("{contlen}", Orfo.contlen);
			if (orfoComment=='full' || orfoComment=='comm') result += " " + conttxt;
			if (orfoComment=='full' || orfoComment=='email') result += " " + contnam;
			return result;
		}
	}

	var get_context = function() {
		try{
			var text=null;
			var selection=null;
			if (w.getSelection) {
				selection=w.getSelection();
			} else {
				if (d.getSelection) {
					selection=d.getSelection();
				} else {
					selection=d.selection;
				}
			}
			if (selection!=null) {
				var prev="", text=null, next="";
				if (selection.getRangeAt) {
					var r=selection.getRangeAt(0);
					text=r.toString();
					var rngA=d.createRange();
					rngA.setStartBefore(r.startContainer.ownerDocument.body);
					rngA.setEnd(r.startContainer,r.startOffset);
					prev=rngA.toString();
					var rngB=r.cloneRange();
					rngB.setStart(r.endContainer,r.endOffset);
					rngB.setEndAfter(r.endContainer.ownerDocument.body);
					next=rngB.toString();
				} else {
					if (selection.createRange) {
						var r=selection.createRange();
						text=r.text;
						var rngA=selection.createRange();
						rngA.moveStart("character",-Orfo.contlen);
						rngA.moveEnd("character",-text.length);
						prev=rngA.text;
						var rngB=selection.createRange();
						rngB.moveEnd("character",Orfo.contlen);
						rngB.moveStart("character",text.length);
						next=rngB.text;
					} else {
						text=""+selection;
					}
				}
				if (text=="") return null;
				var p;
				var s = (p=text.match(/^(\s*)/)) && p[0].length;
				var e = (p=text.match(/(\s*)$/)) && p[0].length;
				prev += text.substring(0,s);
				Orfo.prev = prev.substring(prev.length-Orfo.contlen,prev.length).replace(/^\S{1,10}\s+/,"");
				next = text.substring(text.length-e,text.length)+next;
				Orfo.next = next.substring(0,Orfo.contlen).replace(/\s+\S{1,10}$/,"");
				Orfo.text = text.substring(s,text.length-e);
				return true;
			} else {
				alert(Orfo.lng.badbrowser);
				return false;
			}
		} catch(e) {
			return null;
		}
	};

	var do_send = function() {
		with (Orfo.settings) {
			var data = {
				lang: Orfo.lang,
				ref: d.location.href,
				nostat: Orfo.nostat,
				prev: Orfo.prev,
				text: Orfo.text,
				next: Orfo.next
			};
			if (orfoSourceType=='dynamic') {
				if (orfoComment=='full' || orfoComment=='comm') data.comm = $('#orfoForm input[name="comm"]').val();
				if (orfoComment=='full' || orfoComment=='email') {
					data.name = $('#orfoForm input[name="name"]').val();
					data.email = $('#orfoForm input[name="email"]').val();
				}
			}
			if (loader) $.loader(true, Orfo.settings);
			$.ajax({
				type: "POST",
				url: Orfo.url,
				data: data,
				success: function(data, textStatus){
					do_thanks();
				},
				error: function(){
					alert(Orfo.lng.error);
				},
				complete: function(){
					if (loader) $.loader(false, Orfo.settings);
				}
			});
			
		}
		return false;
	};

	var do_thanks = function() {
		$('#orfoForm').clearForm();
		Orfo.prev = '';
		Orfo.next = '';
		Orfo.text = '';
		alert(Orfo.lng.thanks)
	};

	// ������� �� ����������� ��������
	var do_confirm = function(reccurent) {
		var ts=new Date().getTime();
		var result=confirm(Orfo.lng.docmsg+"\
--------------------------------------\n   "+d.location.href+"\n\n"+Orfo.lng.subject+"\
--------------------------------------\n   \"..."+Orfo.cont+"...\"\
--------------------------------------\n\n"+Orfo.lng.title);
		var dt=new Date().getTime()-ts;
		if (result) {
			do_send();
		} else {
			if (!reccurent && dt<50) {
				var sv = d.onkeyup;
				d.onkeyup = function(e) {
					if (!e) e = window.event;
					if (e.keyCode==17) { // Ctrl is up.
						d.onkeyup = sv;
						do_confirm(true);
					}
				};
			}
		}
	};

	var do_check = function(click) {
		if(navigator.appName.indexOf("Netscape")!=-1 && eval(navigator.appVersion.substring(0,1))<5){
			alert(Orfo.lng.badbrowser);
			return false;
		}
		Orfo.cont = '';
		if (!get_context()) {
			if (click) with (Orfo.settings) {
				if (orfoSourceType=='dynamic') {
					$("#"+orfoSourceID).modal('show');
				} else {
					alert(Orfo.lng.alt);
				}
			}
			return false;
		}
		var cont=(Orfo.prev+Orfo.seltag1+Orfo.text+Orfo.seltag2+Orfo.next).trims();
		if (cont.length > Orfo.maxlen) {
			alert(Orfo.lng.toobig);
			return false;
		}
		Orfo.cont = cont;
		with (Orfo.settings) {
			if (orfoSourceType=='dynamic') {
				// ������� � �������� �������
				$("#"+orfoSourceID).modal('show');
			} else {
				// ������� �� ����������� ��������
				do_confirm();
			}
		}
		return true;
	};

	// �������� ������������
	var on_keypress = function(e) {
		var pressed=0;
		var we=w.event;
		if (we) {
			// IE & Opera
			pressed=we.keyCode==10 || // IE
				(we.keyCode==13 && we.ctrlKey); // Opera
		} else if (e) {
			pressed=(e.which==10 && e.modifiers==2) || // NN4
				(e.keyCode==0 && e.charCode==106 && e.ctrlKey) ||
				(e.keyCode==13 && e.ctrlKey); // Mozilla
		}
		if (pressed) {
			do_check();
			return false;
		}
	};
	// ��������� Esc �������
	var on_keydown_esc = function(e) {
		var code=0;
		var we=w.event;
		if (we) {
			code=we.keyCode;
			if (we.keyCode==13) {
			}
		} else {
			if(e)code=e.keyCode;
		}
		with (Orfo.settings) {
			if (code==13 && !$("#orfoForm button[type=submit]").attr("disabled")) {
				do_send();
				$("#"+orfoSourceID).modal('hide');
				return false;
			}
			if (code==27) $("#"+orfoSourceID).modal('hide');
		}
	};

	// ��������� ����� ����������� � ����������
	var active_but = function(active){
		$("#orfoForm button[type=submit]").prop('disabled', !active);
	}
	var orfoOnOpen = function(e){
		d.onkeydown = on_keydown_esc;
		d.onkeypress = null;
		if (Orfo.cont!='') {
			$("#orfo_cont").html("..."+Orfo.cont+"...");
			if (Orfo.settings.orfoComment!='none') $('#orfoForm input[name="comm"]').blur(null).focus();
			active_but(1);
			Orfo.cont = '';
		} else {
			$("#orfo_cont").html(get_cont());
			if (Orfo.settings.orfoComment!='none') $('#orfoForm input[name="comm"]').blur(function(){
				active_but($(this).val()!="");
			}).focus();
			active_but(0);
		}
	};
	var orfoOnClose = function(e){
		d.onkeydown = null;
		d.onkeypress = on_keypress;
	};
	
	$.checkOrfo = function(){
				do_check(1);
				return false;
			};
	//initOrfo       
	$.initOrfo = function(settings){
		Orfo.settings = $.extend(Orfo.settings, {
		//------main settings
			id: 'orfoWindow',
			orfoSourceID: '',
			orfoSourceUrl: Orfo.url,
			orfoSourceType: 'dynamic',			// dynamic, confrim
			orfoComment: 'comm',				// full, email, comm, none
			effects: true,
			loader: true,					// �������� ��� ��������
		//------other
			on_open: orfoOnOpen,
			on_close: orfoOnClose
		}, settings || {});
		with (Orfo.settings) {
			if (orfoSourceType=='dynamic') {
				var create_window = false;
				if (orfoSourceID=='' && $('*').is('#'+id)) {
					orfoSourceID = id	
				} else {
					create_window = (orfoSourceID!='' && !$('*').is('#'+orfoSourceID));
					if (create_window && orfoSourceID=='') {
						// ������������� ����
						orfoSourceID = id+Math.round(Math.random()*1000)
					}
				}
				if (create_window) with (Orfo.lng) {
					// ��� ���� ���������� ���� � ������
					var s =
					'<div id="'+orfoSourceID+'" class="modal fade">'+
					'<div class="modal-dialog modal-lg" role="document">'+
					'<div class="modal-content">'+
						'<div class="modal-header bg-header">'+
							'<h4 class="modal-title"><i class="fa fa-check-square-o"></i> '+title+'</h4>'+
							'<button type="button" class="close" data-dismiss="modal" aria-label="Close">'+
							'	<span aria-hidden="true">&times;</span>'+				
							'</button>'+
						'</div>'+
						'<form id="orfoForm" action="'+orfoSourceUrl+'" method="post">'+
						'<div class="modal-body">'+
							'<label>'+header+'</label>'+
							'<div id="orfo_cont" class="p-3 mb-3 code">'+
								get_cont()+
							'</div>';
					if (orfoComment=='full' || orfoComment=='comm') {
						s = s +	'<div class="mb-3">'+
								'<label for="orfo-comm">'+comment+'</label>'+
								'<input type="text" class="form-control" id="orfo-comm" name="comm" maxlength="1000" />'+
							'</div>';
					}
					if (orfoComment=='full' || orfoComment=='email') {
						s = s +	'<div class="row">'+
								'<div class="col">'+
									'<label for="orfo-name">'+name+'</label>'+
									'<input type="text" class="form-control" id="orfo-name" name="name" maxlength="100">'+
								'</div>'+
								'<div class="col">'+
									'<label for="orfo-email">'+email+'</label>'+
									'<input type="email" class="form-control" id="orfo-email" name="email">'+
								'</div>'+
							'</div>';
					}
					s = s +	'</div>'+
						'<div class="modal-footer">'+
							'<button type="submit" class="btn btn-primary text-uppercase" disabled>'+send+'</button>'+
							'<button type="button" class="btn btn-secondary text-uppercase" data-dismiss="modal">'+cancel+'</button>'+
						'</div>'+
						'</form>'+
					'</div>'+
					'</div>'+
					'</div>';
					// ������� � �����
					$('body').append(s);
				}
			}
			// ������� ��� ��������-�������� ����
			$("#"+orfoSourceID).on('show.bs.modal', on_open);
			$("#"+orfoSourceID).on('hide.bs.modal', on_close);

			// ������������� ������
			on_close();

			// �������� �����
			$("#orfoForm").submit(function(){
				do_send();
				$("#"+orfoSourceID).modal('hide');
				return false;
			});

			// �������� �� �������
			$('#orfoButton').click($.checkOrfo);
		}
	}

})(jQuery);
