'use strict'

module.exports = class SlotAllocator{
	constructor(base, length){
		this.base = base;
		this.slots = [];
		this.slots.length = length||0;
	}

	test(begin, end, as_much){
		let length = end-begin+1;
		let idx_begin = begin-this.base;

		for(var i=0; i<length; ++i){
			let slot = idx_begin+i;

			if(this.slots[slot] == true){
				break;
			}
		}

		if(as_much || i==length){
			return i;
		}
		else{
			return 0;
		}
	}

	alloc(begin, end, as_much){
		if(this.test(begin, end, as_much)>0){
			return this._alloc(begin, end);
		}
		else{
			return 0;
		}
	}

	_alloc(slot_begin, slot_end){
		//console.log('_alloc', slot_begin, slot_end);

		for(var i=slot_begin; i<slot_end; ++i){
			this.slots[i-this.base] = true;
		}
		return slot_end-slot_begin;
	}

	clone(){
		let allocator = new SlotAllocator(this.base, 0);
		allocator.slots = this.slots.splice(0);
		return allocator;
	}
}