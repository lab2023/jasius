
/*
Awesome Uploader
AwesomeUploader JavaScript Class

Copyright (c) 2010, Andrew Rymarczyk
All rights reserved.

Redistribution and use in source and minified, compiled or otherwise obfuscated 
form, with or without modification, are permitted provided that the following 
conditions are met:

	* Redistributions of source code must retain the above copyright notice, 
		this list of conditions and the following disclaimer.
	* Redistributions in minified, compiled or otherwise obfuscated form must 
		reproduce the above copyright notice, this list of conditions and the 
		following disclaimer in the documentation and/or other materials 
		provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND 
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED 
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE 
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL 
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR 
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER 
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, 
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE 
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

Ext.ns('Ext.ux');

Ext.ux.AwesomeUploader = Ext.extend(Ext.Container, {
	initComponent:function(){
		
		this.addEvents(
			'fileselected'
				//fired when a file is selected
			,'fileselectionerror'
				// fireEvent('fileselectionerror', String message)
				//fired by drag and drop and swfuploader if a file that is too large is selected.
				//Swfupload also fires this even if a 0-byte file is selected or the file type does not match the "flashSwfUploadFileTypes" mask
			,'uploadstart'
				//may be called multiple times for drag and drop uploads!
			,'uploadprogress'
				//fired when an upload progress event is received
			,'uploadcomplete' 
				// fireEvent('fileupload', Obj thisUploader, Bool uploadSuccessful, Obj serverResponse);
				//server response object will at minimum have a property "error" describing the error.
			,'uploadremoved'
			,'uploadaborted'
			,'uploaderror'
		);

		this.initialConfig = this.initialConfig || {};
		
		Ext.apply(this, {
			awesomeUploaderRoot: this.initialConfig.awesomeUploaderRoot || ''
			,i18n: Ext.ux.AwesomeUploaderLocalization
			,locale:'english'
		});
		
		Ext.apply(this, this.initialConfig, {
			flashButtonSprite:this.awesomeUploaderRoot+'swfupload_browse_button_trans_56x22.PNG'
			,autoStartUpload:false
			,alwaysShowFullFilePath:false
			,allowDragAndDropAnywhere:false
			,flashButtonWidth:56
			,flashButtonHeight:22
			,flashUploadFilePostName:'Filedata'
			,disableFlash:false
			,flashSwfUploadPath:this.awesomeUploaderRoot+'swfupload.swf'
			,flashSwfUploadFileTypes:'*.*'
			,flashSwfUploadFileTypesDescription:this.i18n[this.locale].browseWindowFileDescription
			,flashUploadUrl:this.awesomeUploaderRoot+'upload.php'
			,xhrUploadUrl:this.awesomeUploaderRoot+'xhrupload.php'
			,xhrFileNameHeader:'X-File-Name'
			,xhrExtraPostDataPrefix:'extraPostData_'
			,xhrFilePostName:'Filedata'
			,xhrSendMultiPartFormData:false
			,maxFileSizeBytes: 3145728 // 3 * 1024 * 1024 = 3 MiB
			,standardButtonText: this.i18n[this.locale].browseButtonText
			,standardUploadFilePostName:'Filedata'
			,standardUploadUrl:this.awesomeUploaderRoot+'upload.php'
			,supressPopups:false
			,extraPostData:{}
			,swfUploadStopped:false
			//,width:56
			//,height:22
			,fileId:0 //counter for unique file ids
			,fileQueue:{}
			,swfUploadQueue:{}
			,items:{
				xtype:'box' //upload button container
				,listeners:{
					scope:this
					,render:function(){
						this.initSWFUpload();
						this.initDragAndDropUploader();
					}
				}
			}
		});
		
		Ext.ux.AwesomeUploader.superclass.initComponent.apply(this, arguments);
	}
	,startUpload:function(){
		var fileId;
		for(fileId in this.fileQueue){
			if(this.fileQueue[fileId].status == 'started'){
				continue;
			}
			switch(this.fileQueue[fileId].method){
				case 'swfupload':
					this.swfUploadStopped = false;
					if(this.fileQueue[fileId].status == 'error' ){
						this.swfUploader.requeueUpload(this.fileQueue[fileId].swfuploadFile.id);
					}
					
					var swfUploaderStats = this.swfUploader.getStats()
						,swfUploadStarted = false;
						
					if(swfUploaderStats.in_progress == 1){
						swfUploadStarted = true;
					}
					if(swfUploadStarted){
						break;
					}
					this.swfUploadUploadStart();
					break;
				case 'standard':
					this.standardUploadStart(this.fileQueue[fileId]);
					break;
				case 'dnd':
					this.dragAndDropUploadStart(this.fileQueue[fileId]);
					break;
			}
		}
	}
	,abortAllUploads:function(){
		var fileId;
		for(fileId in this.fileQueue){
			this.abortUpload(fileId);
		}
	}
	,abortUpload:function(fileId){
	
		if(this.fileQueue[fileId].status == 'started'){
		
			switch(this.fileQueue[fileId].method){
				case 'swfupload':
					this.swfUploadStopped = true;
					this.swfUploader.stopUpload();
					break;
				case 'standard':
					if(this.fileQueue[fileId].frame.contentWindow.stop){// Firefox
						this.fileQueue[fileId].frame.contentWindow.stop();
					}
					if(Ext.isIE){
						window[this.fileQueue[fileId].frame.id].document.execCommand('Stop');
					}
					break;
				case 'dnd':
					this.fileQueue[fileId].upload.xhr.abort();
					break;
			}
			this.fileQueue[fileId].status = 'aborted';
			this.fireEvent('uploadaborted', this, Ext.apply({}, this.fileQueue[fileId]));
		}
	}
	,removeAllUploads:function(){
		var fileId;
		for( fileId in this.fileQueue){
			this.removeUpload(fileId);
		}
	}
	,removeUpload:function(fileId){
		if(this.fileQueue[fileId].status == 'started'){
			this.abortUpload(fileId);
		}
		switch(this.fileQueue[fileId].method){
			case 'swfupload':
				this.swfUploader.cancelUpload(this.fileQueue[fileId].swfuploadFile.id, false);
				break;
		}
		
		this.fileQueue[fileId].status = 'removed';
		var fileInfo = {
			id: fileId
			,name: this.fileQueue[fileId].name
			,size: this.fileQueue[fileId].size
		};
		delete this.fileQueue[fileId];
		this.fireEvent('uploadremoved', this, fileInfo);
	}
	,initSWFUpload:function(){
		
		if(this.disableFlash){
			this.initStandardUpload();
			return true;
		}
		var settings = {
			flash_url: this.flashSwfUploadPath
			,upload_url: this.flashUploadUrl
			,file_size_limit: this.maxFileSizeBytes + ' B'
			,file_types: this.flashSwfUploadFileTypes
			,file_types_description: this.flashSwfUploadFileTypesDescription
			,file_upload_limit: 100
			,file_queue_limit: 0
			,debug: false
			,post_params: this.extraPostData
			,button_image_url: this.flashButtonSprite
			,button_width: this.flashButtonWidth
			,button_height: this.flashButtonHeight
			,button_window_mode: 'opaque'
			,file_post_name: this.flashUploadFilePostName
			,button_placeholder: this.items.items[0].el.dom
			,file_queued_handler: this.swfUploadfileQueued.createDelegate(this)
			,file_dialog_complete_handler: this.swfUploadFileDialogComplete.createDelegate(this)
			,upload_start_handler: this.swfUploadUploadStarted.createDelegate(this)
			,upload_error_handler: this.swfUploadUploadError.createDelegate(this)
			,upload_progress_handler: this.swfUploadUploadProgress.createDelegate(this)
			,upload_success_handler: this.swfUploadSuccess.createDelegate(this)
			,upload_complete_handler: this.swfUploadComplete.createDelegate(this)
			,file_queue_error_handler: this.swfUploadFileQueError.createDelegate(this)
			,minimum_flash_version: '9.0.28'
			,swfupload_load_failed_handler: this.initStandardUpload.createDelegate(this)
		};
		this.swfUploader = new SWFUpload(settings);
	}
	,initDragAndDropUploader:function(){

		this.el.on({
			dragenter:function(event){
				event.browserEvent.dataTransfer.dropEffect = 'move';
				return true;
			}
			,dragover:function(event){
				event.browserEvent.dataTransfer.dropEffect = 'move';
				event.stopEvent();
				return true;
			}
			,drop:{
				scope:this
				,fn:function(event){
					event.stopEvent();
					var files = event.browserEvent.dataTransfer.files;

					if(files === undefined){
						return true;
					}
					var len = files.length;
					while(--len >= 0){
						this.processDragAndDropFileUpload(files[len]);
					}
				}
			}
		});
		
		var body = Ext.fly(document.body);
			
		if(this.allowDragAndDropAnywhere){
			
			body.on({
				dragenter:function(event){
					event.browserEvent.dataTransfer.dropEffect = 'move';
					return true;
				}
				,dragover:function(event){
					event.browserEvent.dataTransfer.dropEffect = 'move';
					event.stopEvent();
					return true;
				}
				,drop:{
					scope:this
					,fn:function(event){
						event.stopEvent();
						var files = event.browserEvent.dataTransfer.files;
	
						if(files === undefined){
							return true;
						}
						var len = files.length;
						while(--len >= 0){
							this.processDragAndDropFileUpload(files[len]);
						}
					}
				}
			});

		}else{
			// Attach drag and drop listeners that do nothing to the document body
			// this prevents incorrect drops, reloading the page with the dropped item
			// This may or may not be helpful
			if(!document.body.BodyDragSinker){
				document.body.BodyDragSinker = true;
				
				body.on({
					dragenter:function(event){
						return true;
					}
					,dragleave:function(event){
						return true;
					}
					,dragover:function(event){
						event.stopEvent();
						return true;
					}
					,drop:function(event){
						event.stopEvent();
						return true;
					}
				});
			}
		}
		
	}
	,initStandardUpload:function(param){
		if(this.uploader){
			this.uploader.fileInput = null; //remove reference to file field. necessary to prevent destroying file field during an active upload.
			Ext.destroy(this.uploader);
		}
		
		this.uploader = new Ext.ux.form.FileUploadField({
			renderTo:this.items.items[0].el.dom
			,buttonText:this.standardButtonText
			,buttonOnly:true
			,name:this.standardUploadFilePostName
			,listeners:{
				scope:this
				,fileselected:this.standardUploadFileSelected
			}
		});
		
	}
	,uploaderAlert:function(text){
		if(this.supressPopups){
			return true;
		}
		if(this.uploaderAlertMsg === undefined || !this.uploaderAlertMsg.isVisible()){
			this.uploaderAlertMsgText = this.i18n[this.locale].uploaderAlertErrorPrefix +'<BR>'+ text;
			this.uploaderAlertMsg = Ext.MessageBox.show({
				title: this.i18n[this.locale].uploaderAlertErrorPrefix
				,msg: this.uploaderAlertMsgText
				,buttons: Ext.Msg.OK
				,modal: false
				,icon: Ext.MessageBox.ERROR
			});
		}else{
			this.uploaderAlertMsgText += text;
			this.uploaderAlertMsg.updateText(this.uploaderAlertMsgText);
			this.uploaderAlertMsg.getDialog().focus();
		}
		
	}
	,dragAndDropUploadStart:function(fileInfo){
		var upload = new Ext.ux.XHRUpload({
			url:this.xhrUploadUrl
			,filePostName:this.xhrFilePostName
			,fileNameHeader:this.xhrFileNameHeader
			,extraPostData:this.extraPostData
			,sendMultiPartFormData:this.xhrSendMultiPartFormData
			,file:fileInfo.file
			,listeners:{
				scope:this
				,uploadloadstart:function(event){
					this.fireEvent('uploadstart', this, Ext.apply({}, fileInfo) );
				}
				,uploadprogress:function(event){
					this.fireEvent('uploadprogress', this, fileInfo.id, event.loaded, event.total);
				}
				// XHR Browser Events
				,loadstart:function(event){
					fileInfo.status = 'started';
					this.fireEvent('start', this, Ext.apply({}, fileInfo) );
				}
				,progress:function(event){
					this.fireEvent('progress', this, Ext.apply({}, fileInfo), event.loaded, event.total);
				}
				,abort:function(event){
					fileInfo.status = 'aborted';
					this.fireEvent('abort', this, Ext.apply({}, fileInfo), 'XHR upload aborted');
				}
				,error:function(event){
					fileInfo.status = 'error';
					this.fireEvent('error', this, Ext.apply({}, fileInfo), 'XHR upload error');
				}
				,load:function(event){
					this.processUploadResult(fileInfo, upload.xhr.responseText);
				}
			}
		});
		fileInfo.upload = upload;
		upload.send();
	}
	,processDragAndDropFileUpload:function(file){
		var fileInfo = {
			id: ++this.fileId
			,name: file.name
			,size: file.size
			,status:'queued'
			,method: 'dnd'
			,file: file
		};
		
		if(fileInfo.size > this.maxFileSizeBytes){
			this.uploaderAlert('<BR>'+ file.name + this.i18n[this.locale].fileSizeError);
			this.fireEvent('fileselectionerror', this, Ext.apply({}, fileInfo), this.i18n[this.locale].fileSizeEventText);
			return true;
		}
		if(false !== this.fireEvent('fileselected', this, Ext.apply({},fileInfo) ) ){
			this.fileQueue[fileInfo.id] = fileInfo;
			if(this.autoStartUpload){
				this.dragAndDropUploadStart(fileInfo);
			}
		}
	}
	,swfUploadfileQueued:function(file){
		var fileInfo = {
			id: ++this.fileId
			,name: file.name
			,size: file.size
			,status:'queued'
			,method: 'swfupload'
			,swfuploadFile: file
		}
		if(false !== this.fireEvent('fileselected', this, Ext.apply({},fileInfo) ) ){
			this.fileQueue[fileInfo.id] = fileInfo;
			this.swfUploadQueue[file.id] = fileInfo;
		}else{
			this.swfUploader.cancelUpload(file.id, false);	
		}
		return true;
	}
	,swfUploadFileQueError:function(file, error, message){
		var fileInfo = {
			id: ++this.fileId
			,name: file.name
			,size: file.size
			,status:'error'
			,method: 'swfupload'
		}
		this.uploaderAlert('<BR>'+fileInfo.name+'<BR><b>'+message+'</b><BR>');
		this.fireEvent('fileselectionerror', this, Ext.apply({}, fileInfo), message);
	}
	,swfUploadUploadStart:function(){
		this.swfUploader.setPostParams(this.extraPostData); //sync post data with flash
		this.swfUploader.startUpload();
	}
	,swfUploadFileDialogComplete:function(){
		if(this.autoStartUpload){
			this.swfUploadUploadStart();
		}
	}
	,swfUploadUploadProgress:function(file, bytesComplete, bytesTotal){
		this.fireEvent('uploadprogress', this, this.swfUploadQueue[file.id].id, bytesComplete, bytesTotal);	
	}
	,swfUploadUploadStarted:function(file){
		this.swfUploadQueue[file.id].status = 'started';
		this.fireEvent('uploadstart', this, Ext.apply({}, this.swfUploadQueue[file.id]));
	}
	,swfUploadComplete:function(file){ //called if the file is errored out or on success

		if(!this.swfUploadStopped ){
			this.swfUploader.startUpload(); //as per the swfupload docs, start the next upload!
		}
	}
	,swfUploadUploadError:function(file, errorCode, message){

		if(errorCode == -290){ //-290 = "UPLOAD_STOPPED"
			return true;
		}
		
		this.swfUploadQueue[file.id].status = 'error';
		this.uploaderAlert('<BR>'+file.name+'<BR><b>'+message+'</b><BR>');//SWFUpload.UPLOAD_ERROR_DESC[errorCode.toString()]

		this.fireEvent('uploaderror', this, Ext.apply({}, this.swfUploadQueue[file.id]), message);
	}
	,swfUploadSuccess:function(file, serverData){ //called when the file is done
		this.processUploadResult(this.swfUploadQueue[file.id], serverData);
	}
	,standardUploadFileSelected:function(fileBrowser, fileName){
		
		if(!this.alwaysShowFullFilePath){
			var lastSlash = fileName.lastIndexOf('/'); //check for *nix full file path
			if( lastSlash < 0 ){
				lastSlash = fileName.lastIndexOf('\\'); //check for win full file path
			}
			if( lastSlash > 0){
				fileName = fileName.substr(lastSlash+1);
			}
		}
		
		var fileInfo = {
			id: ++this.fileId
			,name:fileName
			,status:'queued'
			,method:'standard'
			,size:'0'
		};
		
		if(Ext.isDefined(fileBrowser.fileInput.dom.files) ){
			fileInfo.size = fileBrowser.fileInput.dom.files[0].size;
		};
		
		if( fileInfo.size > this.maxFileSizeBytes){
			this.uploaderAlert('<BR>'+ fileInfo.name + this.i18n[this.locale].fileSizeError);
			this.fireEvent('fileselectionerror', this, Ext.apply({}, fileInfo), this.i18n[this.locale].fileSizeEventText);
			return true;
		}
		//save reference to filebrowser
		fileInfo.fileBrowser = fileBrowser; 

		var formEl = document.createElement('form'),
			extraPost;

		formEl = this.items.items[0].el.appendChild(formEl);

		fileInfo.fileBrowser.fileInput.addClass('au-hidden');
	
		formEl.appendChild(fileBrowser.fileInput); //add reference from current file browser file input to this newly created form el
		formEl.addClass('au-hidden');
		fileInfo.form = formEl;
		
		this.initStandardUpload(); //re-init uploader for multiple simultaneous uploads
		
		if(false !== this.fireEvent('fileselected', this, Ext.apply({},fileInfo) ) ){
			
			if(this.autoStartUpload){
				this.standardUploadStart();
			}
			this.fileQueue[fileInfo.id] = fileInfo;
		}
		
	}
	,doFormUpload : function(fileInfo){ //o, extraPostData, url){ //based off of Ext.Ajax.doFormUpload
		var id = Ext.id(),
			doc = document,
			frame = doc.createElement('iframe'),
			form = Ext.getDom(fileInfo.form),
			hiddens = [],
			hd,
			encoding = 'multipart/form-data',
			buf = {
				target: form.target,
				method: form.method,
				encoding: form.encoding,
				enctype: form.enctype,
				action: form.action
			};

		/*
		 * Originally this behaviour was modified for Opera 10 to apply the secure URL after
		 * the frame had been added to the document. It seems this has since been corrected in
		 * Opera so the behaviour has been reverted, the URL will be set before being added.
		 */
		Ext.fly(frame).set({
			id: id,
			name: id,
			cls: 'x-hidden',
			src: Ext.SSL_SECURE_URL
		}); 

		doc.body.appendChild(frame);

		// This is required so that IE doesn't pop the response up in a new window.
		if(Ext.isIE){
			document.frames[id].name = id;
		}
		Ext.fly(form).set({
			target: id,
			method: 'post',
			enctype: encoding,
			encoding: encoding,
			action: this.standardUploadUrl || buf.action
		});

		Ext.iterate(this.extraPostData, function(k, v){
			hd = doc.createElement('input');
			Ext.fly(hd).set({
				type: 'hidden',
				value: v,
				name: k
			});
			form.appendChild(hd);
			hiddens.push(hd);
		});

		function cb(){
			var responseText = '',
				doc;

			try{
				doc = frame.contentWindow.document || frame.contentDocument || window.frames[id].document;
				if(doc){
					if(doc.body){
						responseText = doc.body.innerHTML;
					}
				}
			}
			catch(e) {}

			Ext.EventManager.removeListener(frame, 'load', cb, this);
			Ext.EventManager.removeListener(frame, 'abort', uploadAborted, this);
			
			this.processUploadResult(fileInfo, responseText);

			setTimeout(function(){Ext.removeNode(frame);}, 100);
		}

		Ext.EventManager.on(frame, 'load', cb, this);
		var uploadAborted = function(){
			this.standardUploadFailAbort(fileInfo);
		}
		Ext.EventManager.on(frame, 'abort', uploadAborted, this);
		
		fileInfo.frame = frame;
	
		form.submit();

		Ext.fly(form).set(buf);
		Ext.each(hiddens, function(h){
			Ext.removeNode(h);
		});
	}
	,standardUploadStart:function(fileInfo){
		this.doFormUpload(fileInfo);
		fileInfo.status = 'started';
		this.fireEvent('uploadstart', this, Ext.apply({}, fileInfo));
	}
	,standardUploadFail:function(form, action){
		this.uploaderAlert('<BR>'+form.fileInfo.name+'<BR><b>'+action.result+'</b><BR>');
		form.fileInfo.status = 'error';
		this.fireEvent('uploaderror', this, Ext.apply({}, form.fileInfo), action.result, action.response.responseText);
	}
	,standardUploadFailAbort:function(fileInfo){
		this.uploaderAlert('<BR>'+ fileInfo.name + this.i18n[this.locale].uploadAbortedMessage);
		form.fileInfo.status = 'error';
		this.fireEvent('uploaderror', this, Ext.apply({}, fileInfo), 'aborted');
	}
	,processUploadResult:function(fileInfo, serverData){

		var uploadCompleteData = {};
		if(false !== this.fireEvent('uploadcomplete', this, Ext.apply({},fileInfo), serverData, uploadCompleteData ) ){
			fileInfo.status = 'completed';
		}else{
			this.uploaderAlert('<BR>'+ this.i18n[this.locale].uploadErrorMessage +' <b>'+fileInfo.name+'</b><BR>');
			fileInfo.status = 'error';
			this.fireEvent('uploaderror', this, Ext.apply({}, fileInfo), serverData, uploadCompleteData);
		}
		
	}
});

Ext.reg('awesomeuploader', Ext.ux.AwesomeUploader);
