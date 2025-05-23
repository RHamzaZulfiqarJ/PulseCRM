import Approval from '../models/approval.js'
import User from '../models/user.js'
import Voucher from '../models/voucher.js'
import Lead from '../models/lead.js'
import Notification from '../models/notification.js'
import { createError } from '../utils/error.js'
import validator from 'validator'
import bcrypt from 'bcryptjs'

export const getApproval = async (req, res, next) => {
    try {

        const { approvalId } = req.params
        const findedApproval = await Approval.findById(approvalId).populate('project').exec()
        if (!findedApproval) return next(createError(401, 'Approval not exist'))

        res.status(200).json({ result: findedApproval, message: 'approval fetched seccessfully', success: true })

    } catch (err) {
        next(createError(500, err.message))
    }
}

export const getApprovals = async (req, res, next) => {
    try {

        const { type } = req.query;

        let query = type ? { type } : {};
        const approvals = await Approval.find(query).populate('data.project').exec()

        res.status(200).json({ result: approvals, message: 'approvals fetched seccessfully', success: true })

    } catch (err) {
        next(createError(500, err.message))
    }
}

export const createVoucherApproval = async (req, res, next) => {
    try {

        const result = await Approval.create({
            title: 'Voucher Approval',
            type: 'voucher',
            description: 'Need approval for the voucher',
            data: { ...req.body }
        })

        const notification = await Notification.create({
            title: 'Need Approval for Voucher.',
            type: 'voucher-approval',
            description: `Voucher approval needed.`,
            data: { ...req.body }
        })


        res.status(200).json({ result, notification, message: 'Voucher request has been sent to the admin for approval', success: true })

    } catch (err) {
        next(createError(500, err.message))
    }
}

export const acceptVoucherApproval = async (req, res, next) => {
    try {
        const { approvalId } = req.params;
        const { password } = req.body;

        if (!approvalId || !password) {
            return next(createError(400, 'Approval ID and password are required.'));
        }

        const approval = await Approval.findById(approvalId);
        if (!approval) {
            return next(createError(404, 'Approval not found.'));
        }

        const admin = await User.findById('672b6beeaee13b66dfca3308');
        if (!admin) {
            return next(createError(404, 'Admin user not found.'));
        }

        const isPasswordCorrect = await bcrypt.compare(password, admin.password);
        if (!isPasswordCorrect) {
            return next(createError(401, 'Incorrect Password'));
        }

        const voucher = await Voucher.findOne({ uid: approval.data.uid });
        if (!voucher) {
            return next(createError(404, 'Voucher not found.'));
        }

        await Approval.findByIdAndUpdate(approvalId, { $set: { status: 'accepted' } }, { new: true });
        const result = await Voucher.findByIdAndUpdate(
            voucher._id,
            { $set: { status: 'accepted' } },
            { new: true }
        );

        res.status(200).json({ result, message: 'Voucher accepted successfully', success: true });
    } catch (err) {
        next(createError(500, err.message));
    }
};

export const rejectVoucherApproval = async (req, res, next) => {
    try {
        const { approvalId } = req.params;
        const { password } = req.body;

        if (!approvalId || !password) {
            return next(createError(400, 'Approval ID and password are required.'));
        }

        const approval = await Approval.findById(approvalId);
        if (!approval) {
            return next(createError(404, 'Approval not found.'));
        }

        const admin = await User.findById('672b6beeaee13b66dfca3308');
        if (!admin) {
            return next(createError(404, 'Admin user not found.'));
        }

        const isPasswordCorrect = await bcrypt.compare(password, admin.password);
        if (!isPasswordCorrect) {
            return next(createError(401, 'Incorrect Password'));
        }

        const voucher = await Voucher.findOne({ uid: approval.data.uid });
        if (!voucher) {
            return next(createError(404, 'Voucher not found.'));
        }

        await Approval.findByIdAndUpdate(approvalId, { $set: { status: 'rejected' } }, { new: true });
        const result = await Voucher.findByIdAndUpdate(
            voucher._id,
            { $set: { status: 'rejected' } },
            { new: true }
        );

        res.status(200).json({ result, message: 'Voucher rejected successfully', success: true });
    } catch (err) {
        next(createError(500, err.message));
    }
};

export const createRefundApproval = async (req, res, next) => {
    try {

        const { branch, issuingDate, amount, clientName, CNIC, phone, leadId, reason } = req.body

        const findedLead = await Lead.findById(leadId)

        if (!findedLead) return next(createError(401, 'leadId is not provided'))
        if (findedLead.isAppliedForRefund) return res.status(201).json({ result: findedLead, message: 'Refund request has already been submitted.' })

        const result = await Approval.create({
            title: 'Refund Approval',
            type: 'refund',
            description: 'Need approval for the refund',
            leadId,
            data: { branch, issuingDate, amount, clientName, CNIC, phone, leadId, reason }
        })


        const notification = await Notification.create({
            title: 'Need Approval for Refund.',
            type: 'refund-approval',
            description: `${clientName} needs approval for the refund.`,
            data: { branch, issuingDate, amount, clientName, CNIC, phone, leadId, reason }
        })


        await Lead.findByIdAndUpdate(leadId, { $set: { isAppliedForRefund: true } }, { new: true })

        res.status(200).json({ result, notification, message: 'Refund request has been sent to the admin for approval', success: true })

    } catch (err) {
        next(createError(500, err.message))
    }
}

export const updateRefundApproval = async (req, res, next) => {
    try {

        const { branch, issuingDate, amount, clientName, CNIC, phone, leadId, reason } = req.body

        const findedLead = await Lead.findById(leadId)

        if (!findedLead) return next(createError(401, 'leadId is not provided'))
        if (findedLead.isAppliedForRefund) return res.status(201).json({ result: findedLead, message: 'Refund request has already been submitted.' })

        const result = await Approval.create({
            title: 'Refund Approval',
            type: 'refund',
            description: 'Need approval for the refund',
            leadId,
            data: { branch, issuingDate, amount, clientName, CNIC, phone, leadId, reason }
        })


        const notification = await Notification.create({
            title: 'Need Approval for Refund.',
            type: 'refund-approval',
            description: `${clientName} needs approval for the refund.`,
            data: { branch, issuingDate, amount, clientName, CNIC, phone, leadId, reason }
        })


        await Lead.findByIdAndUpdate(leadId, { $set: { isAppliedForRefund: true } }, { new: true })

        res.status(200).json({ result, notification, message: 'Refund request has been sent to the admin for approval', success: true })

    } catch (err) {
        next(createError(500, err.message))
    }
}

export const deleteApproval = async (req, res, next) => {
    try {

        const { approvalId } = req.params
        const findedApproval = await Approval.findById(approvalId)
        if (!findedApproval) return next(createError(400, 'Approval not exist'))

        const deletedApproval = await Approval.findByIdAndDelete(approvalId)
        res.status(200).json({ result: deletedApproval, message: 'Approval deleted successfully', success: true })

    } catch (err) {
        next(createError(500, err.message))
    }
}

export const deleteWholeCollection = async (req, res, next) => {
    try {

        const result = await Approval.deleteMany()
        res.status(200).json({ result, message: 'Approval collection deleted successfully', success: true })

    } catch (err) {
        next(createError(500, err.message))
    }
}