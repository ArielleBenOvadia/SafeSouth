"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const postScheme = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    imgUrl: {
        type: String,
        required: false,
        default: "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"
    },
    message: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    post_owner_email: {
        type: String,
        required: true,
    },
    post_owner_phone: {
        type: String,
        required: true,
    },
    capacity: {
        type: Number,
        required: true,
    },
    date_start: {
        type: Date,
        required: true
    },
    date_end: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    kosher_home: {
        type: Boolean,
        required: true
    },
    created_at: {
        type: Date,
        required: false
    },
    shabat_save: {
        type: Boolean,
        required: true
    },
    animals_home: {
        type: Boolean,
        required: true
    },
    handicap_home: {
        type: Boolean,
        required: true
    },
    comments: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Comment"
        }]
});
exports.default = mongoose_1.default.model("Post", postScheme);
//# sourceMappingURL=user_post_model.js.map