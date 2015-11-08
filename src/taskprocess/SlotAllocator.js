'use strict'

module.exports = class SlotAllocator{
	constructor(base, length){
		this.base = base;
		this.slots = [];
		this.slots.length = length||0;
	}

	test(begin, end, as_much){
		let length = end-begin;
		let idx_begin = begin-this.base;

		let i;
		for(i=0; i<length; ++i){
			let slot = idx_begin+i;

			if(this.slots[slot] == true){
				// console.log((this.base + slot) + ' allocated.');
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
		console.log('_alloc', slot_begin, slot_end);

		for(var i=slot_begin; i<slot_end; ++i){
			this.slots[i-this.base] = true;
		}
		return slot_end-slot_begin;
	}
}