'use strict';

function updateButtons(history) {
	$('#undo').attr('disabled',!history.canUndo());
	$('#redo').attr('disabled',!history.canRedo());
}

function setEditorContents(contents) {
	$('#editor').val(contents);
}



$(function(){
	var history = new SimpleUndo({
		maxLength: 200,
		provider: function(done) {
			done($('#editor').val());
		},
		onUpdate: function() {
			//onUpdate is called in constructor, making history undefined
			if (!history) return; 
			
			updateButtons(history);
		}
	});
	
	$('#undo').click(function() {
		history.undo(setEditorContents);
	});
	$('#redo').click(function() {
		history.redo(setEditorContents);
	});
	$('#editor').keypress(function() {
		history.save();
	});
	
	updateButtons(history);
});