//  TODO: Create,Update,Delete coupon
import Coupon from "../models/coupon";
import asyncHandler from "../services/asynchandler";
import CustomError from "../utils/customError";

/***********************************************************
 * @Create Coupon
 * @route http://localhost:/api/createCoupon
 * @description creating Coupon for products
 * @parameters code,discount
 * @return User Object
 ***********************************************************/

export const createCoupon = asyncHandler(async (req, res) => {
  const { code, discount } = req.body;

  if (!code || !discount) {
    throw new CustomError("Both Fields are required", 400);
  }

  const coupon = await Coupon.create({
    code,
    discount,
  });

  res.status(200).json({
    success: true,
    message: "Coupon Created Successfully",
    coupon,
  });
});

/***********************************************************
 * @Update Coupon
 * @route http://localhost:/api/UpdateCoupon/:
 * @description for update of coupon
 * @parameters code,discount
 * @return User Object
 ***********************************************************/

export const updateCoupon = asyncHandler(async (req, res) => {
  const { code, discount } = req.body;

  const { id: couponId } = req.params;

  if (!code || !discount) {
    throw new CustomError("Both Fields are required", 400);
  }

  const existingCoupon = await Coupon.findByIdAndUpdate(
    couponId,
    {
      code,
      discount,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!existingCoupon) {
    throw new CustomError("Coupon does not exist", 400);
  }
  res.status(200).json({
    success: true,
    message: "Updated Successfully",
    existingCoupon,
  });
});

/***********************************************************
 * @Delete Coupon
 * @route http://localhost:/api/deleteCoupon/:
 * @description for delete of Coupon
 * @parameters id
 * @return User Object
 ***********************************************************/

export const deleteCoupon = asyncHandler(async (req, res) => {
  const { id: couponId } = req.params;

  const deletedCoupon = await Coupon.findByIdAndDelete(couponId);

  if (!deletedCoupon) {
    throw new CustomError("No such Coupon found", 400);
  }
  res.status(200).json({
    success: true,
    message: "Deleted Successfully",
    deletedCoupon,
  });
});

/***********************************************************
 * @Get a list of Coupon
 * @route http://localhost:/api/deleteCoupon/:
 * @description for delete of Coupon
 * @parameters id
 * @return User Object
 ***********************************************************/

export const getCoupon = asyncHandler(async (_req, res) => {
  const couponCollection = await Coupon.find();

  if (!couponCollection) {
    throw new CustomError("Coupons not found", 401);
  }

  res.status(201).json({
    success: true,
    message: "Coupons Sent",
    couponCollection,
  });
});

/***********************************************************
 * @Change status to inactive of Coupon or active
 * @route http://localhost:/api/changeStatus/:
 * @description for making the coupon inactive
 * @parameters id
 * @return User Object
 ***********************************************************/

export const changeStatus = asyncHandler(async (req, res) => {
  const { id: couponId } = req.params;

  const coupon = await Coupon.findById(couponId);

  if (!coupon) {
    throw new CustomError("Coupon does not exist", 401);
  }

  if (coupon.active === true) {
    coupon.active = false;
    await coupon.save();
  } else {
    coupon.active = true;
    await coupon.save({validateBeforeSave:false});
  }
  res.status(201).json({
    success: true,
    message: "Status change Succesfully",
    coupon,
  });
});
