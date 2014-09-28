var should = require('should');
var SimpleUndo = require('../lib/simple-undo');



describe('SimpleUndo', function() {

	it('should require a provider', function() {
		var history = new SimpleUndo();
		history.save.should.throw();
	});
	
	it('should contain up to maxLength items', function() {
		var count;
		
		var value = 0;
		var provider = function(done) {
			done(value++);
		}
		
		var history = new SimpleUndo({
			provider: provider,
			maxLength: 3
		});
		
		history.initialize('initial');
		
		history.save(); //0
		count = history.count();
		count.should.equal(1);
		history.save(); //1
		count = history.count();
		count.should.equal(2);
		history.save(); //2
		count = history.count();
		count.should.equal(3);
		
		//we reached the limit
		history.save(); //3
		count = history.count();
		count.should.equal(3);
		history.save();//4
		count = history.count();
		count.should.equal(3);

		history.undo(); //3
		history.undo(); //2
		history.undo(function(value){
			value.should.equal(1);
		});
	});
	
	it('should undo and redo', function() {
		
		var provided = 0;
		var provider = function(done) {
			done(provided++);
		}
		
		var history = new SimpleUndo({
			provider: provider,
			maxLength: 3
		});
		
		history.initialize('initial');
		
		history.canUndo().should.be.false;
		history.canRedo().should.be.false;
		
		history.save(); //0
		history.canUndo().should.be.true;
		history.canRedo().should.be.false;
		
		history.undo(function(value) {
			value.should.equal('initial');
		});
		history.canUndo().should.be.false;
		history.canRedo().should.be.true;
		
		history.save(); //1
		history.canUndo().should.be.true;
		history.canRedo().should.be.false;
		
		history.save(); //2
		history.canUndo().should.be.true;
		history.canRedo().should.be.false;
		
		history.undo(function(value) {
			value.should.equal(1);
		});
		history.canUndo().should.be.true;
		history.canRedo().should.be.true;
		
		history.redo(function(value) {
			value.should.equal(2);
		});
		history.canUndo().should.be.true;
		history.canRedo().should.be.false;
	});
	
	it('should call the registered onUpdate callback', function() {
		var provider = function(done) {
			done(Math.random());
		};
		
		var callCount = 0;
		var onUpdate = function() {
			callCount++;
		};
		
		var history = new SimpleUndo({
			provider: provider,
			onUpdate: onUpdate
		});
		
		callCount.should.equal(1);
		history.save();
		callCount.should.equal(2);
		history.undo();
		callCount.should.equal(3);
		history.redo();
		callCount.should.equal(4);
		history.clear();
		callCount.should.equal(5);
	});
	
	it('should reset when cleared', function() {
		var provider = function(done) {
			done(Math.random());
		}
		
		var history = new SimpleUndo({
			provider: provider,
			maxLength: 3
		});
		
		history.initialize('initial');
		
		history.save();
		history.save();
		history.undo();
		history.save();
		history.undo();
		history.redo();
		history.clear();
		
		history.count().should.equal(0);
		history.save();
		history.undo(function(value){
			value.should.equal('initial');
		});
		
	});
})