var mongoose = require("mongoose");

var ImageSchema = new mongoose.Schema({
	term:{
		type: String,
		required: true
	},
    when: {
        type: Date, 
        default: Date.now
    }
});

module.exports = mongoose.model('Image',ImageSchema);
