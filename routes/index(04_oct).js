var express=require('express');
var app = express();
var Sequelize = require('sequelize');
var env = "dev";
const Op = Sequelize.Op; 

var config = require('../config.json')[env];
var password = config.password ? config.password : null;
var sequelize = new Sequelize(
    config.database,
    config.user,

    config.password, {
        logging: console.log,
          dialect: 'mysql',
        define: {
            timestamps: false
        },
        sync:true
    }
);

var twinBcrypt = require('twin-bcrypt');
var mailer = require('express-mailer');

var file_type_regex = /(?:\.([^.]+))?$/;
var Models = require('./model');
var Messages = require('../common_string')['messages'];
var FCM = require('fcm-node');
var serverKey = 'AAAAUytsZek:APA91bH_PqRoSjDcTO1GcPRc9XhRyFzrrr3RNPRRMi1jRKEbM1xf31fL6Rxo98Ovq7YMbZW4Qj7leoR02xsOanH9hmXMfrGmpopi0AF274g_yJ4M2adw8gG0u-0b3NDImPka0l3Z2QTN'; //put your server key here
var fcm = new FCM(serverKey);

mailer.extend(app, {
    from: 'anjum@gmail.com',
    host: 'smtp.gmail.com', // hostname 
    secureConnection: true, // use SSL 
    port: 465, // port for secure SMTP 
    transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts 
    auth: {
        user: 'nodeteamemail@gmail.com',
        pass: 'promatics'
    }
});

/*paths defined*/
const LOCAL_PUBLIC_PATH = '/var/www/html/anjum/public/';
const GLOBAL_PUBLIC_PATH = 'http://subodh.live/anjum/public/';
const FRONT_IMGS = 'imgs/admin/';
const BACK_IMGS = 'imgs/frontend/';
const LOCAL_IMAGES_URL = LOCAL_PUBLIC_PATH+BACK_IMGS;
const LOGO_PATH = GLOBAL_PUBLIC_PATH+BACK_IMGS+'logo-white.png';
/*paths defined end*/

/*Associations*/
Models.EmployeeAssignCustomers.belongsTo(Models.Customers,{
  	foreignKey: 'customer_id',
	as: 'customer_in_employee_assign'
})

Models.EmployeeAssignCustomers.belongsTo(Models.EmployeeVisits,{
  	foreignKey: 'employee_id',
  	sourceKey: 'employee_id',
	as: 'employee_visit_in_employee_assign'
})

Models.EmployeeVisits.hasMany(Models.EmployeeVisitPhotos,{
  	foreignKey: 'visit_id',
  	// sourceKey: 'employee_id',
	as: 'visit_photos_in_employee_visits'
})

Models.EmployeeVisits.hasMany(Models.EmployeeVisitNotes,{
  	foreignKey: 'visit_id',
  	// sourceKey: 'employee_id',
	as: 'visit_notes_in_employee_visits'
})

Models.Employees.hasOne(Models.EmployeePermissions,{
  	foreignKey: 'employee_id',
  	// sourceKey: 'employee_id',
	as: 'employee_permissions_in_employees'
})

Models.Items.hasMany(Models.ItemUnitConversion,{
  	foreignKey: 'item_id',
	as: 'item_measurement_units'
})

Models.ItemUnitConversion.belongsTo(Models.MeasurementUnit,{
  	foreignKey: 'unit_type_id',
	as: 'measurement_unit_in_unit_conversion'
})

Models.EmployeeCartLoadItems.belongsTo(Models.Items,{
  	foreignKey: 'item_id',
	as: 'item_detail_in_employee_cart_load'
})

Models.EmployeeCartLoadItems.belongsTo(Models.MeasurementUnit,{
  	foreignKey: 'measurement_unit_id',
	as: 'measurement_unit_in_employee_cart_load'
})

Models.EmployeeCartUnloadItems.belongsTo(Models.Items,{
  	foreignKey: 'item_id',
	as: 'item_detail_in_employee_cart_unload'
})

Models.EmployeeCartUnloadItems.belongsTo(Models.MeasurementUnit,{
  	foreignKey: 'measurement_unit_id',
	as: 'measurement_unit_in_employee_cart_unload'
})

Models.EmployeeLoadItemsRequests.hasMany(Models.EmployeeLoadItemsRequestDetail,{
  	foreignKey: 'load_request_id',
	as: 'load_request_detail_in_request'
})

Models.EmployeeUnloadItemsRequests.hasMany(Models.EmployeeUnloadItemsRequestDetail,{
  	foreignKey: 'unload_request_id',
	as: 'unload_request_detail_in_request'
})

Models.EmployeeLoadItemsRequestDetail.belongsTo(Models.Items,{
  	foreignKey: 'item_id',
	as: 'item_detail_in_load_request_detail'
})

Models.EmployeeLoadItemsRequestDetail.belongsTo(Models.MeasurementUnit,{
  	foreignKey: 'measurement_unit_id',
	as: 'measurement_unit_in_load_request_detail'
})

Models.EmployeeLoadItemsRequests.belongsTo(Models.Employees,{
  	foreignKey: 'employee_id',
	as: 'employee_detail_in_load_item_request'
})

Models.EmployeeLoadItemsRequests.belongsTo(Models.Stores,{
  	foreignKey: 'store_id',
	as: 'store_detail_in_load_item_request'
})

Models.EmployeeLoadItemsRequests.belongsTo(Models.Stores,{
  	foreignKey: 'salesman_store_id',
	as: 'salesman_store_detail_in_load_item_request'
})

Models.EmployeeUnloadItemsRequests.belongsTo(Models.Employees,{
  	foreignKey: 'employee_id',
	as: 'employee_detail_in_unload_item_request'
})

Models.EmployeeUnloadItemsRequests.belongsTo(Models.Stores,{
  	foreignKey: 'store_id',
	as: 'store_detail_in_unload_item_request'
})

Models.EmployeeUnloadItemsRequests.belongsTo(Models.Stores,{
  	foreignKey: 'salesman_store_id',
	as: 'salesman_store_detail_in_unload_item_request'
})

Models.EmployeeUnloadItemsRequestDetail.belongsTo(Models.Items,{
  	foreignKey: 'item_id',
	as: 'item_detail_in_unload_request_detail'
})

Models.EmployeeUnloadItemsRequestDetail.belongsTo(Models.MeasurementUnit,{
  	foreignKey: 'measurement_unit_id',
	as: 'measurement_unit_in_unload_request_detail'
})

Models.EmployeeStockTakingRequests.hasMany(Models.EmployeeStockTakingRequestItems,{
  	foreignKey: 'stock_taking_request_id',
	as: 'stock_taking_request_items'
})


Models.SalesOrderCartDetail.belongsTo(Models.Items,{
  	foreignKey: 'item_id',
	as: 'item_detail_in_sales_cart'
})

Models.SalesOrderCartDetail.belongsTo(Models.MeasurementUnit,{
  	foreignKey: 'unit_id',
	as: 'measurement_unit_in_sales_cart'
})

Models.Items.hasMany(Models.priceListItems,{
	foreignKey: 'item_id',
	as: 'price_list'
})

Models.priceListItems.belongsTo(Models.ItemPriceLists,{
	foreignKey: 'price_list_id',
	as: 'items_price_lists'
})

Models.Customers.hasOne(Models.EmployeeVisits,{
	foreignKey: 'customer_id',
	as: 'customer_in_employee_visit'
})

Models.Employees.belongsTo(Models.Users,{
  	foreignKey: 'user_id',
  	// sourceKey: 'employee_id',
	as: 'branch_in_employees'
})

Models.Users.belongsTo(Models.Countries,{
  	foreignKey: 'country_id',
  	// sourceKey: 'employee_id',
	as: 'country_in_branch'
})

Models.Employees.belongsTo(Models.Employees,{
  	foreignKey: 'supervisor_id',
  	// sourceKey: 'employee_id',
	as: 'supervisor_in_salesman'
})

Models.SalesOrderRequest.belongsTo(Models.Employees,{
  	foreignKey: 'employee_id',
	as: 'employee_detail_in_sales_order_request'
})

Models.SalesOrderRequest.belongsTo(Models.Stores,{
  	foreignKey: 'store_id',
	as: 'store_detail_in_sales_order_request'
})

Models.SalesOrderRequestDetail.belongsTo(Models.Items,{
  	foreignKey: 'item_id',
	as: 'item_detail_in_sales_request_detail'
})

Models.OutputQuantityPromotionItems.belongsTo(Models.Items,{
  	foreignKey: 'item_id',
	as: 'item_detail_in_output_quantity_promotion_items'
})

Models.SalesOrderRequestDetail.belongsTo(Models.MeasurementUnit,{
  	foreignKey: 'measurement_unit_id',
	as: 'measurement_unit_in_sales_request_detail'
})

Models.OutputQuantityPromotionItems.belongsTo(Models.MeasurementUnit,{
  	foreignKey: 'measurement_unit_id',
	as: 'measurement_unit_in_output_quantity_promotion_items'
})

Models.OutputQuantityPromotionItems.belongsTo(Models.Promotions,{
  	foreignKey: 'qty_promotion_id',
	as: 'output_quantity_promotion_details'
})

Models.SalesOrderRequestDetail.hasMany(Models.SalesOrderRequestDetailPromotion,{
  	foreignKey: 'sales_order_request_detail_id',
	as: 'promotions_in_sales_order_request_details'
})

Models.SalesOrderRequestDetailPromotion.belongsTo(Models.Promotions,{
  	foreignKey: 'promotion_id',
	as: 'sales_order_request_promotion_details'
})

Models.Promotions.hasMany(Models.PromotionsRangeGroupsItems,{
  	foreignKey: 'range_group_id',
	as: 'range_promotion_items_in_promotions'
})

Models.Promotions.hasMany(Models.PackagePromotionItems,{
  	foreignKey: 'package_promotion_id',
	as: 'package_promotion_items_in_promotions'
})

Models.Promotions.hasMany(Models.QuantityPromotionItems,{
  	foreignKey: 'qty_promotion_id',
	as: 'quantity_promotion_items_in_promotions'
})

Models.PromotionsRangeGroupsItems.belongsTo(Models.Items,{
  	foreignKey: 'free_item_id',
	as: 'range_group_free_items'
})

Models.PromotionsRangeGroupsItems.belongsTo(Models.MeasurementUnit,{
  	foreignKey: 'free_unit_id',
	as: 'range_group_free_item_measurement_unit'
})

// Models.SalesOrderCartDetail.belongsTo(Models.Promotions,{
//   	foreignKey: 'promotion_id',
// 	as: 'promotions_in_sales_cart_items'
// })
Models.SalesOrderCartDetail.hasMany(Models.SalesOrderCartPromotion,{
  	foreignKey: 'sales_order_cart_id',
	as: 'promotions_in_sales_cart_details'
})
Models.SalesOrderCartPromotion.belongsTo(Models.Promotions,{
  	foreignKey: 'promotion_id',
	as: 'sales_cart_promotion_details'
})

Models.StockItems.belongsTo(Models.Items,{
  	foreignKey: 'item_id',
	as: 'item_detail_in_stock_items'
})

Models.StockItems.belongsTo(Models.MeasurementUnit,{
  	foreignKey: 'measurement_unit_id',
	as: 'measurement_unit_in_stock_items'
})

Models.Items.belongsTo(Models.ItemCategories,{
  	foreignKey: 'category_id',
	as: 'category_detail_in_items'
})

Models.Items.belongsTo(Models.ItemSubCategories,{
  	foreignKey: 'sub_category_id',
	as: 'sub_category_detail_in_items'
})

Models.CustomerDrawers.belongsTo(Models.Customers,{
  	foreignKey: 'customer_id',
	as: 'customer_detail_in_customer_drawers'
})
/*Associations end*/

exports.home = function(req, res){
	if(req.query.token){
		_sendPushNotificationAndroid(req.query.token,'Dummy check','This is testing notify','');
	}
	res.send('<h2>Anjum Rest APIS Home Page</h2>');
}

exports.employee_login = function(req, res){
	// console.log(req.body);
	var email = req.body.email;
	var password = req.body.password;
	var app_device_id = req.body.app_device_id;
	if(email != "" && email != null && password != "" && password != null && app_device_id != "" && app_device_id != null){
		Models.Employees.findOne({
								where:{
									$or:[{
										email:email
									},{
										username:email
									}]
								},include:[{
									model:Models.EmployeePermissions,
									as:'employee_permissions_in_employees',
								},{
									model:Models.Employees,
									as:'supervisor_in_salesman',
									attributes: { 
										include:['id','user_id','employee_name_en','employee_name_ar','phone_no','username','salesmanager_id']
									}
								},{
									model:Models.Users,
									as:'branch_in_employees',
									include:[{
										model:Models.Countries,
										as:'country_in_branch'
									}]
								}]
							}).then(empData => {
								if(empData != null){
									var authAttempt = twinBcrypt.compareSync(password, empData.password);

									if(authAttempt){
										if(empData.status != null && empData.status == 'active'){
											if(empData.app_device_id != null && empData.app_device_id != ''){
												if(empData.app_device_id == app_device_id){
													res.end(JSON.stringify({
												                            response: 1,
												                            message: Messages['en'].LOGIN_SUCCESS,
												                            result : empData
												                        }));
												}else{
													res.end(JSON.stringify({
												                            response: 6,
												                            message: Messages['en'].ALREADY_LOGIN,
												                            result: empData.id
												                        }));
												}
											}else{
												empData.update({app_device_id:app_device_id}).then(updatedEmp => {
													res.end(JSON.stringify({
												                            response: 1,
												                            message: Messages['en'].LOGIN_SUCCESS,
												                            result : empData
												                        }));
												},err => {
													console.log(err);
													res.end(JSON.stringify({
										                            response: 0,
										                            message: Messages['en'].ERROR_FETCH
										                        }));
												})
											}
										}else{
											res.end(JSON.stringify({
									                            response: 5,
									                            message: Messages['en'].INACTIVE_RECORD
									                        }));
										}
									}else{
										res.end(JSON.stringify({
							                            response: 4,
							                            message: Messages['en'].PASSWORD_NOT_MATCHED
							                        }));
									}
								}else{
									res.end(JSON.stringify({
							                            response: 3,
							                            message: Messages['en'].NOT_FOUND
							                        }));	
								}
							}, error => {
								console.log(error);
								res.end(JSON.stringify({
							                            response: 0,
							                            message: Messages['en'].ERROR_FETCH
							                        }));
							})
		
	}else{
		res.end(JSON.stringify({
	                            response: 2,
	                            message: Messages['en'].WRONG_DATA
	                        }));
	}
}

exports.employee_logout = function(req, res){
	if(req.body.employee_id != null && req.body.employee_id != ""){
		Models.Employees.update({
			app_device_id:""
		},{
			where:{
				id:req.body.employee_id
			}
		}).then(updatedEmp => {
			// Models.GcmDevices.destroy({
			// 		where:{
			// 			user_id:req.body.user_id,
			// 			employee_id:req.body.employee_id,
			// 			device_id:req.body.device_id
			// 		}
			// 	})
			res.end(JSON.stringify({
	                            response: 1,
	                            message: Messages['en'].SUCCESS_UPDATE,
	                            result : updatedEmp
	                        }));
		}, error => {
			console.log(error);
			res.end(JSON.stringify({
		                            response: 0,
		                            message: Messages['en'].ERROR_FETCH
		                        }));
		})
	}else{
		res.end(JSON.stringify({
	                            response: 2,
	                            message: Messages['en'].WRONG_DATA
	                        }));	
	}
}

exports.employee_update_device_id = function(req, res){
	if(req.body.employee_id != null && req.body.employee_id != "" && req.body.app_device_id != null && req.body.app_device_id != ""){
		Models.Employees.findOne({
			where:{
				id:req.body.employee_id
			}
		}).then(findEmp => {
			if(findEmp != null){
				console.log('app_device_id ========= >>>',req.body.app_device_id);
				if(findEmp.app_device_id != "" && findEmp.app_device_id != null && findEmp.app_device_id != req.body.app_device_id){
						console.log('already ;login');
					res.end(JSON.stringify({
			                            response: 4,
			                            message: Messages['en'].ALREADY_LOGIN
			                        }));	
				}else{
					if(findEmp.app_device_id == req.body.app_device_id){
						console.log('resp 1');
						res.end(JSON.stringify({
				                            response: 1,
				                            message: Messages['en'].SUCCESS_UPDATE
				                        }));
					}else{
						console.log('resp 1 else');
						findEmp.update({
								app_device_id:req.body.app_device_id
						}).then(updateEmp => {
							res.end(JSON.stringify({
				                            response: 1,
				                            message: Messages['en'].SUCCESS_UPDATE
				                        }));
						},error => {
							res.end(JSON.stringify({
				                            response: 0,
				                            message: Messages['en'].ERROR_FETCH
				                        }));
						})
					}
				}
			}else{
				res.end(JSON.stringify({
			                            response: 3,
			                            message: Messages['en'].EMPTY_DATA
			                        }));
			}
		},err => {
			console.log(err);
			res.end(JSON.stringify({
		                            response: 0,
		                            message: Messages['en'].ERROR_FETCH
		                        }));
		})
	}else{
		res.end(JSON.stringify({
	                            response: 2,
	                            message: Messages['en'].WRONG_DATA
	                        }));	
	}
}

exports.categories_list = function(req, res){
	// console.log(req.body);
	var user_id = req.body.user_id;
	if(user_id != "" && user_id != null){
		Models.ItemCategories.findAll({
										where:{
											user_id:user_id
										}
									}).then(itemCategories => {
										if(itemCategories.length > 0){
											res.end(JSON.stringify({
							                            response: 1,
							                            message: Messages['en'].SUCCESS_FETCH,
							                            result:itemCategories
							                        }));
										}else{
											res.end(JSON.stringify({
							                            response: 3,
							                            message: Messages['en'].EMPTY_DATA
							                        }));
										}
									}, error => {
										res.end(JSON.stringify({
							                            response: 0,
							                            message: Messages['en'].ERROR_FETCH
							                        }));
									})
	}else{
		res.end(JSON.stringify({
	                            response: 2,
	                            message: Messages['en'].WRONG_DATA
	                        }));
	}
	
}

exports.emloyeeAllCustomers = function(req, res){
	if(req.query.employee_id != "" && req.query.employee_id != null){
		Models.EmployeeAssignCustomers.findAll({
			where:{
				employee_id:req.query.employee_id
			},
			include: [{
				model: Models.Customers,
				as: 'customer_in_employee_assign',
				include: [{
					model: Models.EmployeeVisits,
					as: 'customer_in_employee_visit',
					where:{
						employee_id:req.query.employee_id,
						current_visit_status:{
							$ne:'ended'
						}
					},
					required:false
				}]
			}]
		}).then(empAssignCust => {
			if(empAssignCust.length > 0){
				res.end(JSON.stringify({
			                            response: 1,
			                            message: Messages['en'].SUCCESS_FETCH,
			                            result: empAssignCust
			                        }));
			}else{
				res.end(JSON.stringify({
			                            response: 3,
			                            message: Messages['en'].EMPTY_DATA
			                        }));
			}
		}, error => {
			console.log('error in all customers fetch', error);
			res.end(JSON.stringify({
		                            response: 0,
		                            message: Messages['en'].ERROR_FETCH
		                        }));
		})
	}else{
		res.end(JSON.stringify({
	                            response: 2,
	                            message: Messages['en'].WRONG_DATA
	                        }));
	}
}

exports.sub_categories_list = function(req, res){
	if(req.query.category_id != null && req.query.category_id != ""){
		Models.ItemSubCategories.findAll({
			where:{
				category_id:req.query.category_id
			}
		}).then(subCategories => {
			if(subCategories.length > 0){
				res.end(JSON.stringify({
			                            response: 1,
			                            message: Messages['en'].SUCCESS_FETCH,
			                            result: subCategories
			                        }));
			}else{
				res.end(JSON.stringify({
			                            response: 3,
			                            message: Messages['en'].EMPTY_DATA
			                        }));
			}
		},error => {
			res.end(JSON.stringify({
		                            response: 0,
		                            message: Messages['en'].ERROR_FETCH
		                        }));
		})
	}else{
		res.end(JSON.stringify({
	                            response: 2,
	                            message: Messages['en'].WRONG_DATA
	                        }));	
	}
}

exports.start_end_employee_visit = function(req, res){
	if(req.body.employee_id != "" && req.body.employee_id != null && req.body.user_id != "" && req.body.user_id != null && req.body.customer_id != "" && req.body.customer_id != null && req.body.current_date_time != "" && req.body.current_date_time != null && req.body.current_visit_status != "" && req.body.current_visit_status != null){

		var employee_id = req.body.employee_id,
			user_id = req.body.user_id,
			customer_id = req.body.customer_id,
			current_date_time = req.body.current_date_time,
			current_visit_status = req.body.current_visit_status;

		if(current_visit_status == 'started'){
			Models.EmployeeVisits.findOne({
				where:{
					employee_id:employee_id,
					current_visit_status:'started'
				}
			}).then(employeeCheck => {
				if(employeeCheck !=  null){
					res.end(JSON.stringify({
	                            response: 4,
	                            message: Messages['en'].VISIT_ALREADY_RUNNING,
	                            result: employeeCheck
	                        }));
				}else{
					if(req.body.battery_life != "" && req.body.battery_life != null && req.body.android_version != "" && req.body.android_version != null && req.body.latitude != "" && req.body.latitude != null && req.body.longitude != "" && req.body.longitude != null){
						Models.EmployeeVisits.create({
							employee_id:employee_id,
							user_id:user_id,
							customer_id:customer_id,
							start_date_time:current_date_time,
							battery_life:req.body.battery_life,
							android_version:req.body.android_version,
							latitude:req.body.latitude,
							longitude:req.body.longitude,
							current_visit_status:current_visit_status
						},{
							where:{
								id:req.body.visit_id						
							}
						}).then(employeeVisitInsert => {
							res.end(JSON.stringify({
			                            response: 1,
			                            message: Messages['en'].SUCCESS_INSERT,
			                            result: employeeVisitInsert
			                        }));
						},error => {
							res.end(JSON.stringify({
				                        response: 2,
				                        message: Messages['en'].WRONG_DATA
				                    }));
						})
					}else{
						res.end(JSON.stringify({
		                            response: 2,
		                            message: Messages['en'].WRONG_DATA
		                        }));
					}
				}
			}, error => {
				console.log('error',error)
				res.end(JSON.stringify({
	                        response: 2,
	                        message: Messages['en'].WRONG_DATA
	                    }));	
			})
		}else if(current_visit_status == 'ended'){
			if(req.body.visit_id != null && req.body.visit_id != ""){
				Models.EmployeeVisits.update({
					end_date_time:current_date_time,
					current_visit_status:current_visit_status
				},{
					where:{
						id:req.body.visit_id						
					}
				}).then(employeeVisitUpdate => {
					res.end(JSON.stringify({
	                            response: 1,
	                            message: Messages['en'].SUCCESS_UPDATE,
	                            result: employeeVisitUpdate
	                        }));
				},error => {
					res.end(JSON.stringify({
		                        response: 0,
		                        message: Messages['en'].ERROR_FETCH
		                    }));
				})
			}else{
				res.end(JSON.stringify({
                            response: 2,
                            message: Messages['en'].WRONG_DATA
                        }));
			}
		}else{
			res.end(JSON.stringify({
                        response: 5,
                        message: Messages['en'].WRONG_STATUS
                    }));
		}
	}else{
		res.end(JSON.stringify({
                    response: 2,
                    message: Messages['en'].WRONG_DATA
                }));	
	}
}

exports.add_photo_during_visit = function(req, res){
	if(req.body.user_id != "" && req.body.user_id != null && req.body.employee_id != "" && req.body.employee_id != null && req.body.customer_id != "" && req.body.customer_id != null && req.files && req.body.visit_id != "" && req.body.visit_id != null){

		var user_id = req.body.user_id
			employee_id = req.body.employee_id 
			customer_id = req.body.customer_id 
			visit_id = req.body.visit_id;

		let image = req.files.photo;
		filename1 = Date.now() + '_' + Math.floor(10000 + Math.random() * 90000)+"."+file_type_regex.exec(image.name)[1] ;
        req.body.image_name = filename1;

        _uploadImage(image, LOCAL_IMAGES_URL+'employee_visit/photo/' + filename1, filename1, function(resp_type, response, extra){
            if(resp_type == "success"){
                console.log(extra)
                req.body.image_name = filename1;
            }

            if(resp_type == "error"){
                res.end(JSON.stringify({
                    response: 0,
                    message: messages.ERROR_FETCH
                }))
            }
        })

        Models.EmployeeVisitPhotos.create(req.body).then(employeeVisitPhoto => {
        	if(req.body.comment != null && req.body.comment != ""){
        		req.body.photo_id = employeeVisitPhoto.id;
	        	Models.EmployeeVisitPhotoComments.create(req.body).then(commentVisitPhoto => {
	        		console.log('commentVisitPhoto',commentVisitPhoto);
	        	},err => {
	        		console.log('err', err);
	        	});
        	}

        	res.end(JSON.stringify({
                        response: 1,
                        message: Messages['en'].SUCCESS_INSERT,
                        result: employeeVisitPhoto
                    }));
        },error => {
        	console.log('error in add photo', error);
			res.end(JSON.stringify({
                        response: 0,
                        message: Messages['en'].SOMETHING_WRONG
                    }));
        })

	}else{
		console.log(req.body,req.files.photo);
		res.end(JSON.stringify({
                    response: 2,
                    message: Messages['en'].WRONG_DATA
                }));
	}
}

exports.add_note_during_visit = function(req, res){
	if(req.body.user_id != "" && req.body.user_id != null && req.body.employee_id != "" && req.body.employee_id != null && req.body.customer_id != "" && req.body.customer_id != null && req.body.visit_id != "" && req.body.visit_id != null && req.body.note != "" && req.body.note != null){

        Models.EmployeeVisitNotes.create(req.body).then(employeeVisitNote => {
        	res.end(JSON.stringify({
                        response: 1,
                        message: Messages['en'].SUCCESS_INSERT,
                        result: employeeVisitNote
                    }));
        },error => {
			res.end(JSON.stringify({
                        response: 0,
                        message: Messages['en'].SOMETHING_WRONG
                    }));
        })

	}else{
		res.end(JSON.stringify({
                    response: 2,
                    message: Messages['en'].WRONG_DATA
                }));
	}
}

exports.current_running_visit = function(req, res){
	if(req.query.employee_id != null && req.query.employee_id != ""){
		Models.EmployeeVisits.findOne({
			where:{
				employee_id:req.query.employee_id,
				current_visit_status:{
					$ne:'ended'
				}
			}
		}).then(employeeCurrentVisit => {
			if(employeeCurrentVisit != null){
				res.end(JSON.stringify({
                	        response: 1,
                    	    message: Messages['en'].SUCCESS_FETCH,
                        	result: employeeCurrentVisit
                    	}));
			}else{
				res.end(JSON.stringify({
			                            response: 3,
			                            message: Messages['en'].EMPTY_DATA
			                        }));
			}
		},error => {
			console.log('error in current visit',error);
			res.end(JSON.stringify({
                        response: 0,
                        message: Messages['en'].ERROR_FETCH
                    }));
		})
	}else{
		res.end(JSON.stringify({
                    response: 2,
                    message: Messages['en'].WRONG_DATA
                }));
	}
}

// exports.all_items_list = function(req, res){
// 	if(req.body.user_id != "" && req.body.user_id != null){
// 		var filter={};
// 		// filter
// 		if(req.body.order_by != "" && req.body.order_by != null && req.body.order_type != "" && req.body.order_type != null){
// 			if(req.body.order_type == 'asc' || req.body.order_type == 'desc'){
// 				let order = [];
// 				order.push(req.body.order_by);
// 				order.push(req.body.order_type);
// 				filter.order = [order];
// 			}
// 		}

// 		if((req.body.category_id != "" && req.body.category_id != null) || (req.body.sub_category_id != "" && req.body.sub_category_id != null)){
// 			console.log('stage 1----')
// 			let where_query = {};
// 			if(req.body.category_id != "" && req.body.category_id != null){
// 				console.log('stage 2----category_id')
// 				where_query.category_id = req.body.category_id;
// 			}

// 			if(req.body.sub_category_id != "" && req.body.sub_category_id != null){
// 				console.log('stage 2----subcategory_id')
// 				where_query.sub_category_id = req.body.sub_category_id;
// 			}

// 			where_query.user_id = req.body.user_id;
// 			console.log('where_query',where_query)
// 			filter.where = where_query
// 		}else{
// 			filter.where = {user_id:req.body.user_id}
// 		}

// 		filter.include = {
// 							model:Models.ItemUnitConversion,
// 							as:'item_measurement_units',
// 							include:[{
// 								model:Models.MeasurementUnit,
// 								as:'measurement_unit_in_unit_conversion',
// 							}]	
// 						}
// 		console.log('filter-- >',filter);
// 		Models.Items.findAll(
// 							filter
// 							).then(itemsList => {
// 			if(itemsList.length > 0){
// 				res.end(JSON.stringify({
//                 	        response: 1,
//                     	    message: Messages['en'].SUCCESS_FETCH,
//                         	result: itemsList
//                     	}));
// 			}else{
// 				res.end(JSON.stringify({
// 			                            response: 3,
// 			                            message: Messages['en'].EMPTY_DATA
// 			                        }));
// 			}
// 		},error => {
// 			console.log('all_items_list error == -- --  - - ', error)
// 			res.end(JSON.stringify({
//                         response: 0,
//                         message: Messages['en'].ERROR_FETCH
//                     }));
// 		})
// 	}else{
// 		res.end(JSON.stringify({
//                     response: 2,
//                     message: Messages['en'].WRONG_DATA
//                 }));
// 	}
// }

exports.all_items_list = function(req, res){
	if(req.body.user_id != "" && req.body.user_id != null && req.body.employee_id != "" && req.body.employee_id != null){
		Models.EmployeeAssignItems.findAll({
			where: {
				user_id: req.body.user_id,
				employee_id: req.body.employee_id,
				status: 'active'
			}
		}).then(items=>{
			if(items.length>0){
				var item_ids = items.map(function(value) {
                    return value.item_id;
                });	
				var filter={};
				// filter
				if(req.body.order_by != "" && req.body.order_by != null && req.body.order_type != "" && req.body.order_type != null){
					if(req.body.order_type == 'asc' || req.body.order_type == 'desc'){
						let order = [];
						order.push(req.body.order_by);
						order.push(req.body.order_type);
						filter.order = [order];
					}
				}
				let where_query = {};
				if((req.body.category_id != "" && req.body.category_id != null) || (req.body.sub_category_id != "" && req.body.sub_category_id != null)){
					console.log('stage 1----')
					// let where_query = {};
					if(req.body.category_id != "" && req.body.category_id != null){
						console.log('stage 2----category_id')
						where_query.category_id = req.body.category_id;
					}

					if(req.body.sub_category_id != "" && req.body.sub_category_id != null){
						console.log('stage 2----subcategory_id')
						where_query.sub_category_id = req.body.sub_category_id;
					}

					where_query.user_id = req.body.user_id;
					where_query.id = {[Op.in]: item_ids}
					console.log('where_query',where_query)
					filter.where = where_query
				}else{
					// filter.where = {user_id:req.body.user_id}
					where_query.user_id = req.body.user_id;
					where_query.id = {[Op.in]: item_ids}
					filter.where = where_query
				}

				filter.include = {
									model:Models.ItemUnitConversion,
									as:'item_measurement_units',
									include:[{
										model:Models.MeasurementUnit,
										as:'measurement_unit_in_unit_conversion',
									}]	
								}
				console.log('filter-- >',filter);
				Models.Items.findAll(
									filter
									).then(itemsList => {
					if(itemsList.length > 0){
						res.end(JSON.stringify({
			            	        response: 1,
			                	    message: Messages['en'].SUCCESS_FETCH,
			                    	result: itemsList
			                	}));
					}else{
						res.end(JSON.stringify({
					                            response: 3,
					                            message: Messages['en'].EMPTY_DATA
					                        }));
					}
				},error => {
					console.log('all_items_list error == -- --  - - ', error)
					res.end(JSON.stringify({
			                    response: 0,
			                    message: Messages['en'].ERROR_FETCH
			                }));
				})

			}else{
				res.end(JSON.stringify({
                    response: 3,
                    message: Messages['en'].EMPTY_DATA
                }));
			}
			
		},err=>{
			console.log('error == -- --  - - ', err)
			res.end(JSON.stringify({
                response: 0,
                message: Messages['en'].ERROR_FETCH
            }));
		})
		
	}else{
		res.end(JSON.stringify({
            response: 2,
            message: Messages['en'].WRONG_DATA
        }));
	}
}


exports.employee_timeline = function(req, res){
	if(req.body.user_id != "" && req.body.user_id != null && req.body.employee_id != "" && req.body.employee_id != null){
		var where_query = {};
		where_query.employee_id = req.body.employee_id;
		where_query.current_visit_status = 'ended';
		if(req.body.customer_id != "" && req.body.customer_id != null){
			where_query.customer_id = req.body.customer_id;
		}

		Models.EmployeeVisits.findAll({
			where:where_query,
			include:[{
				model: Models.EmployeeVisitPhotos,
				as: 'visit_photos_in_employee_visits'
			},{
				model: Models.EmployeeVisitNotes,
				as: 'visit_notes_in_employee_visits'
			}]
		}).then(timelineData => {
			if(timelineData != null){
				res.end(JSON.stringify({
                	        response: 1,
                    	    message: Messages['en'].SUCCESS_FETCH,
                        	result: timelineData
                    	}));
			}else{
				res.end(JSON.stringify({
			                            response: 3,
			                            message: Messages['en'].EMPTY_DATA
			                        }));
			}
		},error => {
			console.log('error in timeline', error);
			res.end(JSON.stringify({
                        response: 0,
                        message: Messages['en'].ERROR_FETCH
                    }));
		})
	}else{
		res.end(JSON.stringify({
                    response: 2,
                    message: Messages['en'].WRONG_DATA
                }));	
	}
}

exports.add_before_after_photo_during_visit = function(req, res){
	if(req.files && req.files.before_img && req.files.after_img && req.body.visit_id != "" && req.body.visit_id != null && req.body.user_id != "" && req.body.user_id != null && req.body.employee_id != "" && req.body.employee_id != null && req.body.customer_id != "" && req.body.customer_id != null){

		let before_image = req.files.before_img;
		before_image_name = Date.now() + '_' + Math.floor(10000 + Math.random() * 90000)+"."+file_type_regex.exec(before_image.name)[1] ;
        req.body.before_image_name = before_image_name;

        _uploadImage(before_image, LOCAL_IMAGES_URL+'employee_visit/photo/' + before_image_name, before_image_name, function(resp_type, response, extra){
            if(resp_type == "success"){
                // console.log(extra)
                req.body.before_image_name = before_image_name;
            }

            if(resp_type == "error"){
                res.end(JSON.stringify({
                    response: 0,
                    message: messages.ERROR_FETCH
                }))
            }
        })

        let after_image = req.files.after_img;
		after_image_name = Date.now() + '_' + Math.floor(10000 + Math.random() * 90000)+"."+file_type_regex.exec(after_image.name)[1] ;
        req.body.after_image_name = after_image_name;

        _uploadImage(after_image, LOCAL_IMAGES_URL+'employee_visit/photo/' + after_image_name, after_image_name, function(resp_type, response, extra){
            if(resp_type == "success"){
                // console.log(extra)
                req.body.after_image_name = after_image_name;
            }

            if(resp_type == "error"){
                res.end(JSON.stringify({
                    response: 0,
                    message: messages.ERROR_FETCH
                }))
            }
        })

        Models.EmployeeVisitBeforeAfterPhotos.create(req.body).then(createdBeforeAfter => {
        	if(req.body.comment != null && req.body.comment != ""){
        		req.body.photo_id = createdBeforeAfter.id;
	        	Models.EmployeeVisitBeforeAfterPhotoComments.create(req.body).then(commentBeforeAfterPhoto => {
	        		// console.log('commentVisitPhoto',commentVisitPhoto);
	        	},err => {
	        		console.log('err', err);
	        	});
        	}
        	res.end(JSON.stringify({
                        response: 1,
                        message: Messages['en'].SUCCESS_INSERT,
                        result: createdBeforeAfter
                    }));
        },error => {
        	console.log('error in before after', error);
			res.end(JSON.stringify({
                        response: 0,
                        message: Messages['en'].ERROR_FETCH
                    }));
        })
	}else{
		res.end(JSON.stringify({
                    response: 2,
                    message: Messages['en'].WRONG_DATA
                }));	
	}
}

exports.employee_add_customer = function(req, res){
	if(req.body.user_id != "" && req.body.user_id != null && req.body.employee_id != "" && req.body.employee_id != null && req.body.customer_name_en != "" && req.body.customer_name_en != null && req.body.customer_name_ar != "" && req.body.customer_name_ar != null){
		var customer_data = {};

		customer_data.user_id = req.body.user_id;
		customer_data.app_employee_id = req.body.employee_id;
		customer_data.customer_name_en = req.body.customer_name_en;
		customer_data.customer_name_ar = req.body.customer_name_ar;

		if(req.files && req.files.image != "" && req.files.image != null){
			let profile_img = req.files.image;
			profile_img_name = Date.now() + '_' + Math.floor(10000 + Math.random() * 90000)+"."+file_type_regex.exec(profile_img.name)[1] ;
	        customer_data.image = profile_img_name;

	        _uploadImage(profile_img, LOCAL_IMAGES_URL+'customer_imgs/' + profile_img_name, profile_img_name, function(resp_type, response, extra){
	            if(resp_type == "success"){
	                // console.log(extra)
	                req.body.profile_img_name = profile_img_name;
	            }

	            if(resp_type == "error"){
	                res.end(JSON.stringify({
	                    response: 0,
	                    message: messages.ERROR_FETCH
	                }))
	            }
	        })
			// customer_data.image = req.body.image;
		}

		if(req.body.ref_id != "" && req.body.ref_id != null){
			customer_data.ref_id = req.body.ref_id;
		}

		if(req.body.customer_id != "" && req.body.customer_id != null){
			customer_data.customer_id = req.body.customer_id;
		}

		if(req.body.customer_type_id != "" && req.body.customer_type_id != null){
			customer_data.customer_type_id = req.body.customer_type_id;
		}

		if(req.body.email != "" && req.body.email != null){
			customer_data.email = req.body.email;
		}

		if(req.body.phone_no != "" && req.body.phone_no != null){
			customer_data.phone_no = req.body.phone_no;
		}

		if(req.body.fax != "" && req.body.fax != null){
			customer_data.fax = req.body.fax;
		}

		if(req.body.tax_status != "" && req.body.tax_status != null){
			customer_data.tax_status = req.body.tax_status;
		}

		if(req.body.credit_limit != "" && req.body.credit_limit != null){
			customer_data.credit_limit = req.body.credit_limit;
		}

		if(req.body.cheque_due_date != "" && req.body.cheque_due_date != null){
			customer_data.cheque_due_date = req.body.cheque_due_date;
		}

		if(req.body.discount != "" && req.body.discount != null){
			customer_data.discount = req.body.discount;
		}

		if(req.body.balance != "" && req.body.balance != null){
			customer_data.balance = req.body.balance;
		}

		if(req.body.payment_type != "" && req.body.payment_type != null){
			customer_data.payment_type = req.body.payment_type;
		}

		if(req.body.price_list_id != "" && req.body.price_list_id != null){
			customer_data.price_list_id = req.body.price_list_id;
		}

		if(req.body.state_id != "" && req.body.state_id != null){
			customer_data.state_id = req.body.state_id;
		}

		if(req.body.city_id != "" && req.body.city_id != null){
			customer_data.city_id = req.body.city_id;
		}

		if(req.body.area1 != "" && req.body.area1 != null){
			customer_data.area1 = req.body.area1;
		}

		if(req.body.area2 != "" && req.body.area2 != null){
			customer_data.area2 = req.body.area2;
		}

		if(req.body.location != "" && req.body.location != null){
			customer_data.location = req.body.location;
		}

		if(req.body.latitude != "" && req.body.latitude != null){
			customer_data.latitude = req.body.latitude;
		}

		if(req.body.longitude != "" && req.body.longitude != null){
			customer_data.longitude = req.body.longitude;
		}

		Models.Customers.create(customer_data).then(createdCustomer => {
			if(createdCustomer != null && createdCustomer.id != null){
				let drawer_data = [];
				
				if(!Array.isArray(drawer_data)){
					drawer_data = [req.body.drawer_data];
				}else{
					drawer_data = [req.body.drawer_data];
				}

				if(drawer_data.length > 0){
					for(let i = 0; i < drawer_data.length; i++){
						drawer_data[i.customer_id] = createdCustomer.id;
						Models.CustomerDrawers.create(drawer_data[i])
					}
				}

				res.end(JSON.stringify({
                        response: 1,
                        message: Messages['en'].SUCCESS_INSERT,
                        result: createdCustomer
                    }));
			}else{
				console.log('customer not created');
				res.end(JSON.stringify({
	                        response: 0,
	                        message: Messages['en'].ERROR_CREATE
	                    }));	
			}
		},error => {
			console.log('error in create customer', error);
			res.end(JSON.stringify({
                        response: 0,
                        message: Messages['en'].ERROR_CREATE
                    }));
		})
	}else{
		res.end(JSON.stringify({
                    response: 2,
                    message: Messages['en'].WRONG_DATA
                }));	
	}
}

exports.get_states = function(req, res){
	if(req.query.user_id != "" && req.query.user_id != null){
		Models.Users.findOne({
			where:{
				id:req.query.user_id
			}
		}).then(branchData => {
			if(branchData != null && (branchData.country_id != "" || branchData.country_id != null)){
				Models.States.findAll({
					where:{
						country_id:branchData.country_id
					}
				}).then(allStates => {
					if(allStates.length > 0){
						res.end(JSON.stringify({
	                            response: 1,
	                            message: Messages['en'].SUCCESS_FETCH,
	                            result:allStates
	                        }));
					}else{
						res.end(JSON.stringify({
			                        response: 3,
			                        message: Messages['en'].EMPTY_DATA
			                    }));		
					}
				})
			}else{
				res.end(JSON.stringify({
                            response: 3,
                            message: Messages['en'].EMPTY_DATA
                        }));
			}
		},error => {
			console.log('error in fetching branch detail in get states', error);
			res.end(JSON.stringify({
                        response: 0,
                        message: Messages['en'].ERROR_FETCH
                    }));
		})
	}else{
		res.end(JSON.stringify({
                    response: 2,
                    message: Messages['en'].WRONG_DATA
                }));
	}
}

exports.employee_all_permissions = function(req, res){
	if(req.query.employee_id != "" && req.query.employee_id != null){
		Models.EmployeePermissions.findOne({
			where:{
				employee_id:req.query.employee_id
			}
		}).then(employeePermissions => {
			if(employeePermissions != null){
				res.end(JSON.stringify({
                            response: 1,
                            message: Messages['en'].SUCCESS_FETCH,
                            result:employeePermissions
                        }));
			}else{
				res.end(JSON.stringify({
                            response: 3,
                            message: Messages['en'].EMPTY_DATA
                        }));
			}
		},error => {
			console.log('error in fetching permissions', error);
			res.end(JSON.stringify({
                        response: 0,
                        message: Messages['en'].ERROR_FETCH
                    }));
		})
	}else{
		res.end(JSON.stringify({
                    response: 2,
                    message: Messages['en'].WRONG_DATA
                }));	
	}
}

exports.all_cities = function(req, res){
	if(req.query.state_id != "" && req.query.state_id != null){
		Models.Cities.findAll({
			where:{
				state_id:req.query.state_id
			}
		}).then(allStates => {
			if(allStates.length > 0){
				res.end(JSON.stringify({
                            response: 1,
                            message: Messages['en'].SUCCESS_FETCH,
                            result:allStates
                        }));
			}else{
				res.end(JSON.stringify({
                            response: 3,
                            message: Messages['en'].EMPTY_DATA
                        }));
			}
		},error => {
			console.log('error in fetching cities', error);
			res.end(JSON.stringify({
                        response: 0,
                        message: Messages['en'].ERROR_FETCH
                    }));
		})
	}else{
		res.end(JSON.stringify({
                    response: 2,
                    message: Messages['en'].WRONG_DATA
                }));	
	}
}

exports.all_customer_types = function(req, res){
	console.log('aa -- bb')
	if(req.query.user_id != "" && req.query.user_id != null){
		Models.CustomerTypes.findAll({
			where:{
				user_id:req.query.user_id
			}
		}).then(allCustomerTypes => {
			if(allCustomerTypes.length > 0){
				res.end(JSON.stringify({
                            response: 1,
                            message: Messages['en'].SUCCESS_FETCH,
                            result:allCustomerTypes
                        }));
			}else{
				res.end(JSON.stringify({
                            response: 3,
                            message: Messages['en'].EMPTY_DATA
                        }));
			}
		},error => {
			console.log('error in fetching cities', error);
			res.end(JSON.stringify({
                        response: 0,
                        message: Messages['en'].ERROR_FETCH
                    }));
		})
	}else{
		res.end(JSON.stringify({
                    response: 2,
                    message: Messages['en'].WRONG_DATA
                }));	
	}
}

exports.all_banks = function(req, res){
	console.log('all_banks -- bb')
	if(req.query.user_id != "" && req.query.user_id != null){
		Models.Banks.findAll({
			where:{
				user_id:req.query.user_id
			}
		}).then(allBanks => {
			if(allBanks.length > 0){
				res.end(JSON.stringify({
                            response: 1,
                            message: Messages['en'].SUCCESS_FETCH,
                            result:allBanks
                        }));
			}else{
				res.end(JSON.stringify({
                            response: 3,
                            message: Messages['en'].EMPTY_DATA
                        }));
			}
		},error => {
			console.log('error in fetching banks', error);
			res.end(JSON.stringify({
                        response: 0,
                        message: Messages['en'].ERROR_FETCH
                    }));
		})
	}else{
		res.end(JSON.stringify({
                    response: 2,
                    message: Messages['en'].WRONG_DATA
                }));	
	}
}

exports.all_branches = function(req, res){
	console.log('all_branches -- bb')
	if(req.query.bank_id != "" && req.query.bank_id != null){
		Models.BankBranches.findAll({
			where:{
				bank_id:req.query.bank_id
			}
		}).then(allBanks => {
			if(allBanks.length > 0){
				res.end(JSON.stringify({
                            response: 1,
                            message: Messages['en'].SUCCESS_FETCH,
                            result:allBanks
                        }));
			}else{
				res.end(JSON.stringify({
                            response: 3,
                            message: Messages['en'].EMPTY_DATA
                        }));
			}
		},error => {
			console.log('error in fetching bank branches', error);
			res.end(JSON.stringify({
                        response: 0,
                        message: Messages['en'].ERROR_FETCH
                    }));
		})
	}else{
		res.end(JSON.stringify({
                    response: 2,
                    message: Messages['en'].WRONG_DATA
                }));	
	}
}

exports.load_items_to_cart = function(req, res){
	if(req.body.load_item_id && req.body.load_item_measurement_unit_id && req.body.load_item_quantity && req.body.user_id != "" && req.body.user_id != null && req.body.employee_id != "" && req.body.employee_id != null && req.body.store_id != "" && req.body.store_id != null){
		Models.EmployeeCartLoadItems.findOne({
			where:{
				user_id:req.body.user_id,
				employee_id:req.body.employee_id,
				store_id:req.body.store_id,
				item_id:req.body.load_item_id
			}
		}).then(checkLoad => {
			if(checkLoad != null){
				Models.EmployeeCartLoadItems.update({
					user_id:req.body.user_id,
					employee_id:req.body.employee_id,
					store_id:req.body.store_id,
					item_id:req.body.load_item_id,
					measurement_unit_id:req.body.load_item_measurement_unit_id,
					quantity:req.body.load_item_quantity,
				}, {
					where:{
						id:checkLoad.id
					}
				}).then(loadCartData => {
					console.log('loadCartData',loadCartData);
					res.end(JSON.stringify({
		                        response: 4,
		                        message: Messages['en'].SUCCESS_UPDATE,
		                        result: loadCartData
		                    }));
				}, error => {
					console.log('cart_load_item', error)
					res.end(JSON.stringify({
		                    response: 0,
		                    message: Messages['en'].ERROR_CREATE
		                }));
				})
			}else{
				Models.EmployeeCartLoadItems.create({
					user_id:req.body.user_id,
					employee_id:req.body.employee_id,
					store_id:req.body.store_id,
					item_id:req.body.load_item_id,
					measurement_unit_id:req.body.load_item_measurement_unit_id,
					quantity:req.body.load_item_quantity,
				}).then(loadCartData => {
					console.log('loadCartData',loadCartData);
					res.end(JSON.stringify({
		                        response: 1,
		                        message: Messages['en'].SUCCESS_INSERT,
		                        result: loadCartData
		                    }));
				}, error => {
					console.log('cart_load_item', error)
					res.end(JSON.stringify({
		                    response: 0,
		                    message: Messages['en'].ERROR_CREATE
		                }));
				})
			}
		},err => {
			console.log('cart_load_item_check', err)
				res.end(JSON.stringify({
	                    response: 0,
	                    message: Messages['en'].ERROR_CREATE
	                }));
		})
		
	}else{
		res.end(JSON.stringify({
                    response: 2,
                    message: Messages['en'].WRONG_DATA
                }));
	}
}

exports.unload_items_from_cart = function(req, res){
	if(req.body.unload_item_id && req.body.unload_item_measurement_unit_id && req.body.unload_item_quantity && req.body.user_id != "" && req.body.user_id != null && req.body.employee_id != "" && req.body.employee_id != null && req.body.store_id != "" && req.body.store_id != null){
		Models.EmployeeCartUnloadItems.findOne({
			where:{
					user_id:req.body.user_id,
					employee_id:req.body.employee_id,
					store_id:req.body.store_id,
					item_id:req.body.unload_item_id
				}
		}).then(checkUnload => {
			if(checkUnload != null){
				// console.log()
				Models.EmployeeCartUnloadItems.update({
					user_id:req.body.user_id,
					employee_id:req.body.employee_id,
					store_id:req.body.store_id,
					item_id:req.body.unload_item_id,
					measurement_unit_id:req.body.unload_item_measurement_unit_id,
					quantity:req.body.unload_item_quantity,
				}, {
					where:{
						id:checkUnload.id
					}
				}).then(unloadCartData => {
					console.log('unloadCartData',unloadCartData);
					res.end(JSON.stringify({
		                        response: 4,
		                        message: Messages['en'].SUCCESS_UPDATE,
		                        result: unloadCartData
		                    }));
				}, error => {
					res.end(JSON.stringify({
		                    response: 0,
		                    message: Messages['en'].ERROR_CREATE
		                }));
				})
			}else{
				Models.EmployeeCartUnloadItems.create({
					user_id:req.body.user_id,
					employee_id:req.body.employee_id,
					store_id:req.body.store_id,
					item_id:req.body.unload_item_id,
					measurement_unit_id:req.body.unload_item_measurement_unit_id,
					quantity:req.body.unload_item_quantity,
				}).then(unloadCartData => {
					console.log('unloadCartData',unloadCartData);
					res.end(JSON.stringify({
		                        response: 1,
		                        message: Messages['en'].SUCCESS_INSERT,
		                        result: unloadCartData
		                    }));
				}, error => {
					res.end(JSON.stringify({
		                    response: 0,
		                    message: Messages['en'].ERROR_CREATE
		                }));
				})

			}
		},err => {
			console.log('cart_unload_item_check', err)
				res.end(JSON.stringify({
	                    response: 0,
	                    message: Messages['en'].ERROR_CREATE
	                }));
		})

	}else{
		res.end(JSON.stringify({
                    response: 2,
                    message: Messages['en'].WRONG_DATA
                }));
	}
}

exports.load_items_request_submit = function(req, res){
	if(req.body.load_item_arr && req.body.user_id != "" && req.body.user_id != null && req.body.employee_id != "" && req.body.employee_id != null && req.body.store_id != "" && req.body.store_id != null && req.body.supervisor_id != "" && req.body.supervisor_id != null && req.body.salesman_store_id != "" && req.body.salesman_store_id != null && req.body.level != "" && req.body.level != null){
		var load_item_arr = [];
		if(!Array.isArray(req.body.load_item_arr)){
			load_item_arr = [req.body.load_item_arr]
		}else{
			load_item_arr = req.body.load_item_arr
		}

		let create_load = {};
		
		create_load.user_id=req.body.user_id;
		create_load.employee_id=req.body.employee_id;
		create_load.store_id=req.body.store_id;
		create_load.supervisor_id=req.body.supervisor_id;
		create_load.salesman_store_id=req.body.salesman_store_id;
		create_load.no_of_items=load_item_arr.length;
		create_load.request_level=req.body.level;

		if(req.body.level != null && req.body.level > 1){
			if(req.body.salesmanager_id != "" && req.body.salesmanager_id != null){
				create_load.salesmanager_id=req.body.salesmanager_id;
				create_load.salesmanager_status='pending';
			}else{
				res.end(JSON.stringify({
                    response: 2,
                    message: Messages['en'].WRONG_DATA
                }));
			}
		}

		Models.EmployeeLoadItemsRequests.create(create_load).then(loadRequest => {
			if(loadRequest.id){
				console.log('q step 1 load request id',loadRequest.id);
				let request_id = loadRequest.id;
				for (var i = 0; i < load_item_arr.length; i++) {
					console.log('q step 2');
					if(load_item_arr[i].id && load_item_arr[i].measurement_unit_id && load_item_arr[i].quantity){
						console.log('q step 3');
						Models.EmployeeLoadItemsRequestDetail.create({
							user_id:req.body.user_id,
							employee_id:req.body.employee_id,
							store_id:req.body.store_id,
							salesman_store_id:req.body.salesman_store_id,
							item_id:load_item_arr[i].id,
							load_request_id:request_id,
							measurement_unit_id:load_item_arr[i].measurement_unit_id,
							quantity:load_item_arr[i].quantity,
						}).then(loadCartData => {
							// console.log('loadCartData >>>>>>>>>>>>>>>>>>>>>>',loadCartData);
							Models.EmployeeCartLoadItems.destroy({
								where:{
									user_id:req.body.user_id,
									employee_id:req.body.employee_id,
									store_id:req.body.salesman_store_id,
									item_id:loadCartData.item_id
								}
							});
						}, error => {
							// console.log('error in request detail add', error);
							res.end(JSON.stringify({
			                        response: 0,
			                        message: Messages['en'].ERROR_CREATE
			                    }));
						})

					}

					if(load_item_arr.length - 1 == i ){
						let gcm_obj = {};
						gcm_obj.req_type = 'load',gcm_obj.action = 'request';
						// try{
							if(create_load.supervisor_id != null && create_load.supervisor_id != ""){
								console.log('supervisor_id',create_load.supervisor_id)
								Models.GcmDevices.findOne({
									where:{
										employee_id:create_load.supervisor_id
									}
								}).then(gcmDev => {
									console.log('supervisor_id sending notify')
									if(gcmDev != null && gcmDev.device_token != null){
										_sendPushNotificationAndroid(gcmDev.device_token, 'Load Request', 'You have a new load request', gcm_obj);
									}else{
										console.log('data is null in gcmDev supervisor');
									}
								},error => {
									console.log('error in sending notification');
								})
							}
							// if(create_load.salesmanager_id != null && create_load.salesmanager_id != ""){
							// 	Models.GcmDevices.findOne({
							// 		where:{
							// 			employee_id:create_load.salesmanager_id
							// 		}
							// 	}).then(gcmDev => {
							// 		if(gcmDev != null && gcmDev.device_token != null){
							// 			_sendPushNotificationAndroid(gcmDev.device_token, 'Load Request', 'You have a new load request', gcm_obj);
							// 		}else{
							// 			console.log('data is null in gcmDev salesmanager');
							// 		}
							// 	},error => {
							// 		console.log('error in sending notification');
							// 	})
							// }
						// }catch(e){

						// }

						res.end(JSON.stringify({
		                            response: 1,
		                            message: Messages['en'].SUCCESS_INSERT
		                        }));
					}
				}
			}else{
				res.end(JSON.stringify({
			                        response: 0,
			                        message: Messages['en'].ERROR_CREATE
			                    }));
			}
		},err => {
			res.end(JSON.stringify({
			                        response: 0,
			                        message: Messages['en'].ERROR_CREATE
			                    }));
		})
	}else{
		res.end(JSON.stringify({
                    response: 2,
                    message: Messages['en'].WRONG_DATA
                }));
	}
}

exports.unload_items_request_submit = function(req, res){
	if(req.body.unload_item_arr &&  req.body.user_id != "" && req.body.user_id != null && req.body.employee_id != "" && req.body.employee_id != null && req.body.store_id != "" && req.body.store_id != null && req.body.supervisor_id != "" && req.body.supervisor_id != null && req.body.level != "" && req.body.level != null){
		var unload_item_arr = [];
		if(!Array.isArray(req.body.unload_item_arr)){
			unload_item_arr = [req.body.unload_item_arr]
		}else{
			unload_item_arr = req.body.unload_item_arr
		}

		let create_unload = {};
		
		create_unload.user_id=req.body.user_id;
		create_unload.employee_id=req.body.employee_id;
		create_unload.store_id=req.body.store_id;
		create_unload.supervisor_id=req.body.supervisor_id;
		create_unload.salesman_store_id=req.body.salesman_store_id;
		create_unload.no_of_items=unload_item_arr.length;
		create_unload.request_level=req.body.level;

		if(req.body.level != null && req.body.level > 1){
			if(req.body.salesmanager_id != "" && req.body.salesmanager_id != null){
				create_unload.salesmanager_id=req.body.salesmanager_id;
				create_unload.salesmanager_status='pending';
			}else{
				res.end(JSON.stringify({
                    response: 2,
                    message: Messages['en'].WRONG_DATA
                }));
			}
		}

		Models.EmployeeUnloadItemsRequests.create(create_unload).then(unloadRequest => {
			if(unloadRequest.id){
				for (var i = 0; i < unload_item_arr.length; i++) {
					if(unload_item_arr[i].id && unload_item_arr[i].measurement_unit_id && unload_item_arr[i].quantity){
						Models.EmployeeUnloadItemsRequestDetail.create({
							user_id:req.body.user_id,
							employee_id:req.body.employee_id,
							store_id:req.body.store_id,
							salesman_store_id:req.body.salesman_store_id,
							item_id:unload_item_arr[i].id,
							unload_request_id:unloadRequest.id,
							measurement_unit_id:unload_item_arr[i].measurement_unit_id,
							quantity:unload_item_arr[i].quantity,
						}).then(unloadCartData => {
							// console.log('unloadCartData',unloadCartData);
							console.log('unloadCartData.item_id',unloadCartData.item_id);
							Models.EmployeeCartUnloadItems.destroy({
								where:{
									user_id:req.body.user_id,
									employee_id:req.body.employee_id,
									store_id:req.body.salesman_store_id,
									item_id:unloadCartData.item_id
								}
							});
						}, error => {
							res.end(JSON.stringify({
			                        response: 0,
			                        message: Messages['en'].ERROR_CREATE
			                    }));
						})

						if(unload_item_arr.length - 1 == i ){
							let gcm_obj = {};
							gcm_obj.req_type = 'unload',gcm_obj.action = 'request';
						// try{
							if(create_unload.supervisor_id != null && create_unload.supervisor_id != ""){
								console.log('supervisor_id',create_unload.supervisor_id)
								Models.GcmDevices.findOne({
									where:{
										employee_id:create_unload.supervisor_id
									}
								}).then(gcmDev => {
									console.log('supervisor_id sending notify')
									if(gcmDev != null && gcmDev.device_token != null){
										_sendPushNotificationAndroid(gcmDev.device_token, 'Unload Request', 'You have a new unload request', gcm_obj);
									}else{
										console.log('data is null in gcmDev supervisor');
									}
								},error => {
									console.log('error in sending notification');
								})
							}
							// if(create_unload.salesmanager_id != null && create_unload.salesmanager_id != ""){
							// 	Models.GcmDevices.findOne({
							// 		where:{
							// 			employee_id:create_unload.salesmanager_id
							// 		}
							// 	}).then(gcmDev => {
							// 		if(gcmDev != null && gcmDev.device_token != null){
							// 			_sendPushNotificationAndroid(gcmDev.device_token, 'Unload Request', 'You have a new unload request', gcm_obj);
							// 		}else{
							// 			console.log('data is null in gcmDev salesmanager');
							// 		}
							// 	},error => {
							// 		console.log('error in sending notification');
							// 	})
							// }
						// }catch(e){

						// }
							res.end(JSON.stringify({
			                            response: 1,
			                            message: Messages['en'].SUCCESS_INSERT
			                        }));
						}
					}
				}
			}else{

			}
		})
	}else{
		res.end(JSON.stringify({
                    response: 2,
                    message: Messages['en'].WRONG_DATA
                }));
	}
}

exports.fetch_load_items_cart = function(req, res){
	if(req.body.user_id != "" && req.body.user_id != null && req.body.employee_id != "" && req.body.employee_id != null && req.body.store_id != "" && req.body.store_id != null){
		Models.EmployeeCartLoadItems.findAll({
				where:{
					employee_id:req.body.employee_id,
					user_id:req.body.user_id,
					store_id:req.body.store_id
				},
				include:[{
					model:Models.Items,
					as:'item_detail_in_employee_cart_load',
					include:[{
						model:Models.ItemUnitConversion,
						as:'item_measurement_units',
						include:[{
							model:Models.MeasurementUnit,
							as:'measurement_unit_in_unit_conversion',
						}]
					}]
				},{
					model:Models.MeasurementUnit,
					as:'measurement_unit_in_employee_cart_load'
				}]
			}).then(loadCartDataFetch => {
				console.log('loadCartDataFetch',loadCartDataFetch);
				res.end(JSON.stringify({
	                        response: 1,
	                        message: Messages['en'].SUCCESS_FETCH,
	                        result: loadCartDataFetch
	                    }));
			}, error => {
				res.end(JSON.stringify({
	                    response: 0,
	                    message: Messages['en'].ERROR_FETCH
	                }));
			})
	}else{
		res.end(JSON.stringify({
                    response: 2,
                    message: Messages['en'].WRONG_DATA
                }));
	}
}

exports.fetch_unload_items_cart = function(req, res){
	if(req.body.user_id != "" && req.body.user_id != null && req.body.employee_id != "" && req.body.employee_id != null && req.body.store_id != "" && req.body.store_id != null){
		Models.EmployeeCartUnloadItems.findAll({
				where:{
					employee_id:req.body.employee_id,
					user_id:req.body.user_id,
					store_id:req.body.store_id
				},
				include:[{
					model:Models.Items,
					as:'item_detail_in_employee_cart_unload',
					include:[{
						model:Models.ItemUnitConversion,
						as:'item_measurement_units',
						include:[{
							model:Models.MeasurementUnit,
							as:'measurement_unit_in_unit_conversion',
						}]
					}]
				},{
					model:Models.MeasurementUnit,
					as:'measurement_unit_in_employee_cart_unload'
				}]
			}).then(unloadCartDataFetch => {
				console.log('unloadCartDataFetch',unloadCartDataFetch);
				res.end(JSON.stringify({
	                        response: 1,
	                        message: Messages['en'].SUCCESS_FETCH,
	                        result: unloadCartDataFetch
	                    }));
			}, error => {
				res.end(JSON.stringify({
	                    response: 0,
	                    message: Messages['en'].ERROR_FETCH
	                }));
			})
	}else{
		res.end(JSON.stringify({
                    response: 2,
                    message: Messages['en'].WRONG_DATA
                }));
	}
}

exports.fetch_one_load_item_cart = function(req, res){
	if(req.body.user_id != "" && req.body.user_id != null && req.body.employee_id != "" && req.body.employee_id != null && req.body.store_id != "" && req.body.store_id != null && req.body.item_id != "" && req.body.item_id != null){
		Models.EmployeeCartLoadItems.findOne({
			where:{
				employee_id:req.body.employee_id,
				user_id:req.body.user_id,
				store_id:req.body.store_id,
				item_id:req.body.item_id
			},
			// include:[{
			// 	model:Models.Items,
			// 	as:'item_detail_in_employee_cart_load'
			// },{
			// 	model:Models.MeasurementUnit,
			// 	as:'measurement_unit_in_employee_cart_load'
			// }]
		}).then(loadOneCartDataFetch => {
			console.log('loadOneCartDataFetch',loadOneCartDataFetch);
			if(loadOneCartDataFetch != null){
				res.end(JSON.stringify({
                        response: 1,
                        message: Messages['en'].SUCCESS_FETCH,
                        result: loadOneCartDataFetch
                    }));
			}else{
				res.end(JSON.stringify({
                        response: 3,
                        message: Messages['en'].EMPTY_DATA
                    }));
			}
		}, error => {
			res.end(JSON.stringify({
                    response: 0,
                    message: Messages['en'].ERROR_FETCH
                }));
		})
	}else{
		res.end(JSON.stringify({
                    response: 2,
                    message: Messages['en'].WRONG_DATA
                }));
	}
}

exports.fetch_one_unload_items_cart = function(req, res){
	if(req.body.user_id != "" && req.body.user_id != null && req.body.employee_id != "" && req.body.employee_id != null && req.body.store_id != "" && req.body.store_id != null && req.body.item_id != "" && req.body.item_id != null){
		Models.EmployeeCartUnloadItems.findOne({
			where:{
				employee_id:req.body.employee_id,
				user_id:req.body.user_id,
				store_id:req.body.store_id,
				item_id:req.body.item_id
			},
			// include:[{
			// 	model:Models.Items,
			// 	as:'item_detail_in_employee_cart_unload'
			// },{
			// 	model:Models.MeasurementUnit,
			// 	as:'measurement_unit_in_employee_cart_unload'
			// }]
		}).then(unloadOneCartDataFetch => {
			console.log('unloadOneCartDataFetch',unloadOneCartDataFetch);
			if(unloadOneCartDataFetch != null){
				res.end(JSON.stringify({
                        response: 1,
                        message: Messages['en'].SUCCESS_FETCH,
                        result: unloadOneCartDataFetch
                    }));
			}else{
				res.end(JSON.stringify({
                        response: 3,
                        message: Messages['en'].EMPTY_DATA
                    }));
			}
			
		}, error => {
			res.end(JSON.stringify({
                    response: 0,
                    message: Messages['en'].ERROR_FETCH
                }));
		})
	}else{
		res.end(JSON.stringify({
                    response: 2,
                    message: Messages['en'].WRONG_DATA
                }));
	}
}

exports.delete_load_item_from_cart = function(req, res){
	if(req.body.user_id != "" && req.body.user_id != null && req.body.employee_id != "" && req.body.employee_id != null && req.body.store_id != "" && req.body.store_id != null && req.body.item_id != "" && req.body.item_id != null){
		Models.EmployeeCartLoadItems.destroy({
				where:{
					employee_id:req.body.employee_id,
					user_id:req.body.user_id,
					store_id:req.body.store_id,
					item_id:req.body.item_id
				}
			}).then(deleteLoadCartDataFetch => {
				console.log('deleteLoadCartDataFetch',deleteLoadCartDataFetch);
				res.end(JSON.stringify({
	                        response: 1,
	                        message: Messages['en'].SUCCESS_DELETE,
	                        result: deleteLoadCartDataFetch
	                    }));
			}, error => {
				res.end(JSON.stringify({
	                    response: 0,
	                    message: Messages['en'].ERROR_DELETE
	                }));
			})
	}else{
		res.end(JSON.stringify({
                    response: 2,
                    message: Messages['en'].WRONG_DATA
                }));
	}
}

exports.delete_unload_item_from_cart = function(req, res){
	if(req.body.user_id != "" && req.body.user_id != null && req.body.employee_id != "" && req.body.employee_id != null && req.body.store_id != "" && req.body.store_id != null && req.body.item_id != "" && req.body.item_id != null){
		Models.EmployeeCartUnloadItems.destroy({
				where:{
					employee_id:req.body.employee_id,
					user_id:req.body.user_id,
					store_id:req.body.store_id,
					item_id:req.body.item_id
				}
			}).then(deleteUnloadCartDataFetch => {
				console.log('deleteUnloadCartDataFetch',deleteUnloadCartDataFetch);
				res.end(JSON.stringify({
	                        response: 1,
	                        message: Messages['en'].SUCCESS_DELETE,
	                        result: deleteUnloadCartDataFetch
	                    }));
			}, error => {
				res.end(JSON.stringify({
	                    response: 0,
	                    message: Messages['en'].ERROR_DELETE
	                }));
			})
	}else{
		res.end(JSON.stringify({
                    response: 2,
                    message: Messages['en'].WRONG_DATA
                }));
	}
}

// exports.check_stock_cashavn = function(req, res){
// 	if(req.body.user_id != "" && req.body.user_id != null && req.body.employee_id != "" && req.body.employee_id != null && req.body.store_id != "" && req.body.store_id != null && req.body.item_id != "" && req.body.item_id != null && req.body.measurement_unit_id != "" && req.body.measurement_unit_id != null){
// 		Models.EmployeeLoadedStockItems.findAll({
// 			where: {
// 				user_id: req.body.user_id,
// 				employee_id: req.body.employee_id,
// 				store_id: req.body.store_id,
// 				item_id: req.body.item_id,
// 				measurement_unit_id: req.body.measurement_unit_id,
// 			}
// 		}).then(cashvanStock => {
// 			if(cashvanStock.length>0){
// 				console.log('cashvanStock',cashvanStock);
// 				res.end(JSON.stringify({
//                     response: 1,
//                     message: Messages['en'].SUCCESS_FETCH,
//                     result: cashvanStock
//                 }));
// 			}else{
// 				// console.log();
// 				res.end(JSON.stringify({
//                     response: 3,
//                     message: Messages['en'].EMPTY_DATA
//                 }));
// 			}
// 		}, error => {
// 			console.log('cashvan check stock error',error);
// 			res.end(JSON.stringify({
//                     response: 0,
//                     message: Messages['en'].ERROR_FETCH
//                 }));
// 		})
// 	}else{
// 		res.end(JSON.stringify({
//             response: 2,
//             message: Messages['en'].WRONG_DATA
//         }));
// 	}
// }


exports.check_stock_cashavn = function(req, res){
	// if(req.body.user_id != "" && req.body.user_id != null && req.body.employee_id != "" && req.body.employee_id != null && req.body.store_id != "" && req.body.store_id != null && req.body.item_id != "" && req.body.item_id != null && req.body.measurement_unit_id != "" && req.body.measurement_unit_id != null){
	console.log('cashvan body ============',req.body);
	if(req.body.user_id != "" && req.body.user_id != null && req.body.store_id != "" && req.body.store_id != null && req.body.item_id != "" && req.body.item_id != null && req.body.measurement_unit_id != "" && req.body.measurement_unit_id != null){
		console.log('if cashvan ===============');
		Models.StockItems.findAll({
			where: {
				user_id: req.body.user_id,
				// employee_id: req.body.employee_id,
				store_id: req.body.store_id,
				item_id: req.body.item_id,
				measurement_unit_id: req.body.measurement_unit_id,
			}
		}).then(cashvanStock => {
			if(cashvanStock.length>0){
				console.log('cashvanStock',cashvanStock);
				res.end(JSON.stringify({
                    response: 1,
                    message: Messages['en'].SUCCESS_FETCH,
                    result: cashvanStock
                }));
			}else{
				// console.log();
				res.end(JSON.stringify({
                    response: 3,
                    message: Messages['en'].EMPTY_DATA
                }));
			}
		}, error => {
			console.log('cashvan check stock error',error);
			res.end(JSON.stringify({
                    response: 0,
                    message: Messages['en'].ERROR_FETCH
                }));
		})
	}else{
		console.log('else cashvan ===============');
		res.end(JSON.stringify({
            response: 2,
            message: Messages['en'].WRONG_DATA
        }));
	}
}

exports.get_stores = function(req, res){
	if(req.query.user_id != "" && req.query.user_id != null){
		let where_cond = {};
		where_cond.user_id = req.query.user_id;

		if(req.query.emp_store_id != "" && req.query.emp_store_id != null){
			where_cond.id = {
					$ne:req.query.emp_store_id
				};
		}

		Models.Stores.findAll({
			where:where_cond
		}).then(allStores => {
			if(allStores.length > 0){
				// console.log('allStores',allStores);
				res.end(JSON.stringify({
	                    response: 1,
	                    message: Messages['en'].SUCCESS_FETCH,
	                    result: allStores
	                }));
			}else{
				res.end(JSON.stringify({
	                    response: 3,
	                    message: Messages['en'].EMPTY_DATA
	                }));
			}
		}, error => {
			console.log('get stores error',error);
			res.end(JSON.stringify({
                    response: 0,
                    message: Messages['en'].ERROR_FETCH
                }));
		})
	}else{
		res.end(JSON.stringify({
	            response: 2,
	            message: Messages['en'].WRONG_DATA
	        }));	
	}
}

exports.get_load_requests_list = function(req, res){
	if(req.body.user_id != "" && req.body.user_id != null){
		let where_cond = {};
		where_cond.user_id = req.body.user_id;

		if(req.body.supervisor_id != "" && req.body.supervisor_id != null){
			where_cond.supervisor_id = req.body.supervisor_id;
		}

		if(req.body.salesmanager_id != "" && req.body.salesmanager_id != null){
			where_cond.salesmanager_id = req.body.salesmanager_id;
			where_cond.supervisor_status = 'accepted';
		}

		if(req.body.super_filter_status && req.body.super_filter_status != ""){
			where_cond.supervisor_status = req.body.super_filter_status;
		}

		if(req.body.sales_filter_status && req.body.sales_filter_status != ""){
			where_cond.salesmanager_status = req.body.sales_filter_status;
		}

		if(req.body.store_id && req.body.store_id != ""){
			where_cond.store_id = req.body.store_id;
		}

		if(req.body.salesman_store_id && req.body.salesman_store_id != ""){
			where_cond.salesman_store_id = req.body.salesman_store_id;
		}

		if(req.body.salesman_id && req.body.salesman_id != ""){
			where_cond.employee_id = req.body.salesman_id;
		}

		if(req.body.load_request_id && req.body.load_request_id != ""){
			where_cond.id = req.body.load_request_id;
		}
		console.log('stage 1');

		Models.EmployeeLoadItemsRequests.findAll({
			where:where_cond,
			include:[
			{
				model:Models.Employees,
				as:'employee_detail_in_load_item_request',
				attributes: { 
					include:['id','user_id','employee_name_en','employee_name_ar','phone_no','username']
				}
			},{
				model:Models.Stores,
				as:'store_detail_in_load_item_request',
				attributes: { 
					include:['id', 'user_id', 'store_number', 'store_name_en', 'store_name_ar', 'reference', 'note', 'status']
				}
			},{
				model:Models.Stores,
				as:'salesman_store_detail_in_load_item_request',
				attributes: { 
					include:['id', 'user_id', 'store_number', 'store_name_en', 'store_name_ar', 'reference', 'note', 'status']
				}
			}],
			order: [
            	['id', 'DESC']
        	],
		}).then(allLoadRequests => {
			if(allLoadRequests.length > 0){
				// console.log('allStores',allStores);
				res.end(JSON.stringify({
	                    response: 1,
	                    message: Messages['en'].SUCCESS_FETCH,
	                    result: allLoadRequests
	                }));
			}else{
				res.end(JSON.stringify({
	                    response: 3,
	                    message: Messages['en'].EMPTY_DATA
	                }));
			}
		}, error => {
			console.log('get allLoadRequests error',error);
			res.end(JSON.stringify({
                    response: 0,
                    message: Messages['en'].ERROR_FETCH
                }));
		})
	}else{
		res.end(JSON.stringify({
	            response: 2,
	            message: Messages['en'].WRONG_DATA
	        }));	
	}
}

exports.load_request_change_status_supervisor = function(req, res){
	if(req.body.user_id != "" && req.body.user_id != null && req.body.supervisor_id != "" && req.body.supervisor_id != null && req.body.status != "" && req.body.status != null && req.body.request_id != "" && req.body.request_id != null){
		Models.EmployeeLoadItemsRequests.findOne({
			where:{
				id:req.body.request_id,
				supervisor_id:req.body.supervisor_id,
				supervisor_status:'pending'
			}
		}).then(loadRequestChk => {
			if(loadRequestChk == null){
				res.end(JSON.stringify({
	                    response: 3,
	                    message: Messages['en'].EMPTY_DATA
	                }));
			}else{
				if(req.body.status == "accepted" || req.body.status == "rejected"){
					loadRequestChk.update({
						supervisor_status:req.body.status,
						supervisor_note:req.body.supervisor_note
					}).then(loadReqUpdateRes => {
						let gcm_obj = {};
						gcm_obj.req_type = 'supervisor_load_action',gcm_obj.action = 'supervisor';
						if(loadRequestChk.employee_id != null && loadRequestChk.employee_id != ""){
							console.log('supervisor_id',loadRequestChk.employee_id)
							Models.GcmDevices.findOne({
								where:{
									employee_id:loadRequestChk.employee_id
								}
							}).then(gcmDev => {
								console.log('supervisor_id sending notify')
								if(gcmDev != null && gcmDev.device_token != null){
									_sendPushNotificationAndroid(gcmDev.device_token, 'Load Request', 'Load request no. '+loadRequestChk.id+' has been '+req.body.status, gcm_obj);
								}else{
									console.log('data is null in gcmDev supervisor');
								}
							},error => {
								console.log('error in sending notification');
							})
						}

						if(loadRequestChk.salesmanager_id != null && loadRequestChk.salesmanager_id != ""){
							console.log('supervisor_id',loadRequestChk.salesmanager_id)
							Models.GcmDevices.findOne({
								where:{
									employee_id:loadRequestChk.salesmanager_id
								}
							}).then(gcmDev => {
								console.log('supervisor_id sending notify')
								if(gcmDev != null && gcmDev.device_token != null){
									_sendPushNotificationAndroid(gcmDev.device_token, 'Load Request', 'Load request no. '+loadRequestChk.id+' has been '+req.body.status, gcm_obj);
								}else{
									console.log('data is null in gcmDev supervisor');
								}
							},error => {
								console.log('error in sending notification');
							})
						}

						res.end(JSON.stringify({
							response:1,
							message: Messages['en'].SUCCESS_UPDATE
						}));
					}, err => {
						console.log('get loadRequestUpdateRes error',err);
						res.end(JSON.stringify({
			                    response: 0,
			                    message: Messages['en'].ERROR_FETCH
			                }));			
					})
				}else{
					res.end(JSON.stringify({
	                    response: 4,
	                    message: Messages['en'].WRONG_STATUS
	                }));	
				}
			}
		}, error => {
			console.log('get loadRequestChk error',error);
			res.end(JSON.stringify({
                    response: 0,
                    message: Messages['en'].ERROR_FETCH
                }));	
		})
	}else{
		res.end(JSON.stringify({
	            response: 2,
	            message: Messages['en'].WRONG_DATA
	        }));	
	}
}

exports.get_particular_item_detail = function(req, res){
	if(req.body.user_id != "" && req.body.user_id != null && req.body.item_id != "" && req.body.item_id != null){
		Models.Items.findOne({
			where:{
				id:req.body.item_id,
				user_id:req.body.user_id
			},
			include:[{
				model:Models.ItemUnitConversion,
				as:'item_measurement_units',
				include:[{
					model:Models.MeasurementUnit,
					as:'measurement_unit_in_unit_conversion',
				}]
			}]
		}).then(itemDetail => {
			if(itemDetail != null){
				res.end(JSON.stringify({
	                    response: 1,
	                    message: Messages['en'].SUCCESS_FETCH,
	                    result: itemDetail
	                }));
			}else{
				res.end(JSON.stringify({
	                    response: 3,
	                    message: Messages['en'].EMPTY_DATA
	                }));
			}
		}, error => {
			console.log('get item detail error',error);
			res.end(JSON.stringify({
                    response: 0,
                    message: Messages['en'].ERROR_FETCH
                }));	
		})
	}else{
		res.end(JSON.stringify({
	            response: 2,
	            message: Messages['en'].WRONG_DATA
	        }));	
	}
}

exports.get_all_employees_under_supervisor = function(req, res){
	if(req.body.user_id != null && req.body.user_id != "" && req.body.supervisor_id != null && req.body.supervisor_id != ""){
		Models.Employees.findAll({
			where:{
				user_id:req.body.user_id,
				supervisor_id:req.body.supervisor_id
			},
			attributes: { 
				include:['id','user_id','employee_name_en','employee_name_ar','phone_no','username']
			}
		}).then(salesmanList => {
			if(salesmanList.length > 0){
				res.end(JSON.stringify({
	                    response: 1,
	                    message: Messages['en'].SUCCESS_FETCH,
	                    result: salesmanList
	                }));
			}else{
				res.end(JSON.stringify({
	                    response: 3,
	                    message: Messages['en'].EMPTY_DATA
	                }));
			}
		},error => {
			console.log('get salesman list error',error);
			res.end(JSON.stringify({
                    response: 0,
                    message: Messages['en'].ERROR_FETCH
                }));	
		})
	}else{
		res.end(JSON.stringify({
	            response: 2,
	            message: Messages['en'].WRONG_DATA
	        }));
	}
}

exports.supervisor_modify_load_request_item = function(req, res){
	if(req.body.user_id != null && req.body.user_id != "" && req.body.supervisor_id != null && req.body.supervisor_id != "" && req.body.load_request_detail_id != null && req.body.load_request_detail_id != "" && req.body.measurement_unit_id != null && req.body.measurement_unit_id != "" && req.body.quantity != null && req.body.quantity != ""  && req.body.item_id != null && req.body.item_id != ""){
		Models.EmployeeLoadItemsRequestDetail.findOne({
			where:{
				user_id:req.body.user_id,
				id:req.body.load_request_detail_id,
				item_id:req.body.item_id
			}
		}).then(loadRequestDetail => {
			if(loadRequestDetail != null){
				loadRequestDetail.update({
					measurement_unit_id:req.body.measurement_unit_id,
					quantity:req.body.quantity
				}).then(updatedLoadRequestDetail => {
					res.end(JSON.stringify({
		                    response: 1,
		                    message: Messages['en'].SUCCESS_UPDATE,
		                    result: updatedLoadRequestDetail
		                }));
				}, err => {
					console.log('supervisor updated load item desc error',err);
					res.end(JSON.stringify({
		                    response: 0,
		                    message: Messages['en'].ERROR_FETCH
		                }));
				})
			}else{
				res.end(JSON.stringify({
	                    response: 3,
	                    message: Messages['en'].EMPTY_DATA
	                }));
			}
		},error => {
			console.log('supervisor change load item desc error',error);
			res.end(JSON.stringify({
                    response: 0,
                    message: Messages['en'].ERROR_FETCH
                }));	
		})
	}else{	
		res.end(JSON.stringify({
	            response: 2,
	            message: Messages['en'].WRONG_DATA
	        }));	
	}
}

exports.supervisor_delete_load_request_item = function(req, res){
	if(req.body.user_id != null && req.body.user_id != "" && req.body.supervisor_id != null && req.body.supervisor_id != "" && req.body.load_request_detail_id != null && req.body.load_request_detail_id != "" && req.body.item_id != null && req.body.item_id != ""){
		Models.EmployeeLoadItemsRequestDetail.destroy({
			where:{
				user_id:req.body.user_id,
				id:req.body.load_request_detail_id,
				item_id:req.body.item_id
			}
		}).then(loadRequestDetailDelete => {
				res.end(JSON.stringify({
	                    response: 1,
	                    message: Messages['en'].SUCCESS_UPDATE,
	                    result: loadRequestDetailDelete
	                }));
		},error => {
			console.log('supervisor change load item desc error',error);
			res.end(JSON.stringify({
                    response: 0,
                    message: Messages['en'].ERROR_FETCH
                }));	
		})
	}else{	
		res.end(JSON.stringify({
	            response: 2,
	            message: Messages['en'].WRONG_DATA
	        }));	
	}
}

exports.get_load_request_items_list = function(req, res){
	if(req.body.user_id != null && req.body.user_id != "" && req.body.load_request_id != null && req.body.load_request_id != ""){
		Models.EmployeeLoadItemsRequestDetail.findAll({
			where:{
				load_request_id:req.body.load_request_id,
				user_id:req.body.user_id
			},
			include:[{
					model:Models.Items,
					as:'item_detail_in_load_request_detail'
				},{
					model:Models.MeasurementUnit,
					as:'measurement_unit_in_load_request_detail'
				}]
		}).then(loadRequestItems => {
			if(loadRequestItems.length > 0){
				res.end(JSON.stringify({
	                    response: 1,
	                    message: Messages['en'].SUCCESS_FETCH,
	                    result: loadRequestItems
	                }));
			}else{
				res.end(JSON.stringify({
	                    response: 3,
	                    message: Messages['en'].EMPTY_DATA
	                }));
			}
		}, error => {
			console.log('load request items desc error',error);
			res.end(JSON.stringify({
                    response: 0,
                    message: Messages['en'].ERROR_FETCH
                }));
		})
	}else{
		res.end(JSON.stringify({
	            response: 2,
	            message: Messages['en'].WRONG_DATA
	        }));
	}
}

exports.get_unload_requests_list = function(req, res){
	if(req.body.user_id != "" && req.body.user_id != null){
		let where_cond = {};
		where_cond.user_id = req.body.user_id;

		if(req.body.supervisor_id != "" && req.body.supervisor_id != null){
			where_cond.supervisor_id = req.body.supervisor_id;
		}

		if(req.body.salesmanager_id != "" && req.body.salesmanager_id != null){
			where_cond.salesmanager_id = req.body.salesmanager_id;
			where_cond.supervisor_status = 'accepted';
		}

		if(req.body.super_filter_status && req.body.super_filter_status != ""){
			where_cond.supervisor_status = req.body.super_filter_status;
		}

		if(req.body.sales_filter_status && req.body.sales_filter_status != ""){
			where_cond.salesmanager_status = req.body.sales_filter_status;
		}

		if(req.body.store_id && req.body.store_id != ""){
			where_cond.store_id = req.body.store_id;
		}

		if(req.body.salesman_store_id && req.body.salesman_store_id != ""){
			where_cond.salesman_store_id = req.body.salesman_store_id;
		}

		if(req.body.salesman_id && req.body.salesman_id != ""){
			where_cond.employee_id = req.body.salesman_id;
		}

		if(req.body.unload_request_id && req.body.unload_request_id != ""){
			where_cond.id = req.body.unload_request_id;
		}
		console.log('stage 1');

		Models.EmployeeUnloadItemsRequests.findAll({
			where:where_cond,
			include:[{
				model:Models.Employees,
				as:'employee_detail_in_unload_item_request',
				attributes: { 
					include:['id','user_id','employee_name_en','employee_name_ar','phone_no','username']
				}
			},{
				model:Models.Stores,
				as:'store_detail_in_unload_item_request',
				attributes: { 
					include:['id', 'user_id', 'store_number', 'store_name_en', 'store_name_ar', 'reference', 'note', 'status']
				}
			},{
				model:Models.Stores,
				as:'salesman_store_detail_in_unload_item_request',
				attributes: { 
					include:['id', 'user_id', 'store_number', 'store_name_en', 'store_name_ar', 'reference', 'note', 'status']
				}
			}],
			order: [
            	['id', 'DESC']
        	],
		}).then(allUnloadRequests => {
			if(allUnloadRequests.length > 0){
				// console.log('allStores',allStores);
				res.end(JSON.stringify({
	                    response: 1,
	                    message: Messages['en'].SUCCESS_FETCH,
	                    result: allUnloadRequests
	                }));
			}else{
				res.end(JSON.stringify({
	                    response: 3,
	                    message: Messages['en'].EMPTY_DATA
	                }));
			}
		}, error => {
			console.log('get allUnloadRequests error',error);
			res.end(JSON.stringify({
                    response: 0,
                    message: Messages['en'].ERROR_FETCH
                }));
		})
	}else{
		res.end(JSON.stringify({
	            response: 2,
	            message: Messages['en'].WRONG_DATA
	        }));	
	}
}

exports.unload_request_change_status_supervisor = function(req, res){
	if(req.body.user_id != "" && req.body.user_id != null && req.body.supervisor_id != "" && req.body.supervisor_id != null && req.body.status != "" && req.body.status != null && req.body.request_id != "" && req.body.request_id != null){
		Models.EmployeeUnloadItemsRequests.findOne({
			where:{
				id:req.body.request_id,
				supervisor_id:req.body.supervisor_id,
				supervisor_status:'pending'
			}
		}).then(unloadRequestChk => {
			if(unloadRequestChk == null){
				res.end(JSON.stringify({
	                    response: 3,
	                    message: Messages['en'].EMPTY_DATA
	                }));
			}else{
				if(req.body.status == "accepted" || req.body.status == "rejected"){
					unloadRequestChk.update({
						supervisor_status:req.body.status,
						supervisor_note:req.body.supervisor_note
					}).then(loadReqUpdateRes => {
						let gcm_obj = {};
						gcm_obj.req_type = 'supervisor_unload_action',gcm_obj.action = 'supervisor';
						if(unloadRequestChk.employee_id != null && unloadRequestChk.employee_id != ""){
							console.log('supervisor_id',unloadRequestChk.employee_id)
							Models.GcmDevices.findOne({
								where:{
									employee_id:unloadRequestChk.employee_id
								}
							}).then(gcmDev => {
								console.log('supervisor_id sending notify')
								if(gcmDev != null && gcmDev.device_token != null){
									_sendPushNotificationAndroid(gcmDev.device_token, 'Unload Request', 'Unload request no. '+unloadRequestChk.id+' has been '+req.body.status, gcm_obj);
								}else{
									console.log('data is null in gcmDev supervisor');
								}
							},error => {
								console.log('error in sending notification');
							})
						}

						if(unloadRequestChk.salesmanager_id != null && unloadRequestChk.salesmanager_id != ""){
							console.log('supervisor_id',unloadRequestChk.salesmanager_id)
							Models.GcmDevices.findOne({
								where:{
									employee_id:unloadRequestChk.salesmanager_id
								}
							}).then(gcmDev => {
								console.log('supervisor_id sending notify')
								if(gcmDev != null && gcmDev.device_token != null){
									_sendPushNotificationAndroid(gcmDev.device_token, 'Unload Request', 'Unload request no. '+unloadRequestChk.id+' has been '+req.body.status, gcm_obj);
								}else{
									console.log('data is null in gcmDev supervisor');
								}
							},error => {
								console.log('error in sending notification');
							})
						}

						res.end(JSON.stringify({
							response:1,
							message: Messages['en'].SUCCESS_UPDATE
						}));
					}, err => {
						console.log('get loadRequestUpdateRes error',err);
						res.end(JSON.stringify({
			                    response: 0,
			                    message: Messages['en'].ERROR_FETCH
			                }));			
					})
				}else{
					res.end(JSON.stringify({
	                    response: 4,
	                    message: Messages['en'].WRONG_STATUS
	                }));	
				}
			}
		}, error => {
			console.log('get loadRequestChk error',error);
			res.end(JSON.stringify({
                    response: 0,
                    message: Messages['en'].ERROR_FETCH
                }));	
		})
	}else{
		res.end(JSON.stringify({
	            response: 2,
	            message: Messages['en'].WRONG_DATA
	        }));	
	}
}

exports.supervisor_modify_unload_request_item = function(req, res){
	if(req.body.user_id != null && req.body.user_id != "" && req.body.supervisor_id != null && req.body.supervisor_id != "" && req.body.unload_request_detail_id != null && req.body.unload_request_detail_id != "" && req.body.measurement_unit_id != null && req.body.measurement_unit_id != "" && req.body.quantity != null && req.body.quantity != ""  && req.body.item_id != null && req.body.item_id != ""){
		Models.EmployeeUnloadItemsRequestDetail.findOne({
			where:{
				user_id:req.body.user_id,
				id:req.body.unload_request_detail_id,
				item_id:req.body.item_id
			}
		}).then(unloadRequestDetail => {
			if(unloadRequestDetail != null){
				unloadRequestDetail.update({
					measurement_unit_id:req.body.measurement_unit_id,
					quantity:req.body.quantity
				}).then(updatedUnloadRequestDetail => {
					res.end(JSON.stringify({
		                    response: 1,
		                    message: Messages['en'].SUCCESS_UPDATE,
		                    result: updatedUnloadRequestDetail
		                }));
				}, err => {
					console.log('supervisor updated unload item desc error',err);
					res.end(JSON.stringify({
		                    response: 0,
		                    message: Messages['en'].ERROR_FETCH
		                }));
				})
			}else{
				res.end(JSON.stringify({
	                    response: 3,
	                    message: Messages['en'].EMPTY_DATA
	                }));
			}
		},error => {
			console.log('supervisor change unload item desc error',error);
			res.end(JSON.stringify({
                    response: 0,
                    message: Messages['en'].ERROR_FETCH
                }));	
		})
	}else{	
		res.end(JSON.stringify({
	            response: 2,
	            message: Messages['en'].WRONG_DATA
	        }));	
	}
}

exports.supervisor_delete_unload_request_item = function(req, res){
	if(req.body.user_id != null && req.body.user_id != "" && req.body.supervisor_id != null && req.body.supervisor_id != "" && req.body.unload_request_detail_id != null && req.body.unload_request_detail_id != "" && req.body.item_id != null && req.body.item_id != ""){
		Models.EmployeeUnloadItemsRequestDetail.destroy({
			where:{
				user_id:req.body.user_id,
				id:req.body.unload_request_detail_id,
				item_id:req.body.item_id
			}
		}).then(unloadRequestDetailDelete => {
				res.end(JSON.stringify({
	                    response: 1,
	                    message: Messages['en'].SUCCESS_UPDATE,
	                    result: unloadRequestDetailDelete
	                }));
		},error => {
			console.log('supervisor change unload item desc error',error);
			res.end(JSON.stringify({
                    response: 0,
                    message: Messages['en'].ERROR_FETCH
                }));	
		})
	}else{	
		res.end(JSON.stringify({
	            response: 2,
	            message: Messages['en'].WRONG_DATA
	        }));	
	}
}

exports.get_unload_request_items_list = function(req, res){
	if(req.body.user_id != null && req.body.user_id != "" && req.body.unload_request_id != null && req.body.unload_request_id != ""){
		Models.EmployeeUnloadItemsRequestDetail.findAll({
			where:{
				unload_request_id:req.body.unload_request_id,
				user_id:req.body.user_id
			},
			include:[{
					model:Models.Items,
					as:'item_detail_in_unload_request_detail'
				},{
					model:Models.MeasurementUnit,
					as:'measurement_unit_in_unload_request_detail'
				}]
		}).then(loadRequestItems => {
			if(loadRequestItems.length > 0){
				res.end(JSON.stringify({
	                    response: 1,
	                    message: Messages['en'].SUCCESS_FETCH,
	                    result: loadRequestItems
	                }));
			}else{
				res.end(JSON.stringify({
	                    response: 3,
	                    message: Messages['en'].EMPTY_DATA
	                }));
			}
		}, error => {
			console.log('load request items desc error',error);
			res.end(JSON.stringify({
                    response: 0,
                    message: Messages['en'].ERROR_FETCH
                }));
		})
	}else{
		res.end(JSON.stringify({
	            response: 2,
	            message: Messages['en'].WRONG_DATA
	        }));
	}
}

exports.add_items_to_sales_cart = function(req, res){
	// req.body = {
	// 				"user_id": "7",
	// 				"employee_id": "13",
	// 				"customer_id": "88",
	// 				"item_id": "1",
	// 				"quantity": "30",
	// 				"unit_id": "23",
	// 				"total_price": 1575,
	// 				"total_price_before_tax": 1500,
	// 				"total_tax": 75,
	// 				"base_price_per_unit": 50,
	// 				"tax_type": "percentage",
	// 				"total_price_with_tax": 1575,
	// 				"promotions_data": [{
	// 				"promotion_id": "76",
	// 				"promotion_type": "range",
	// 				"promotion_bonus_item_id": "4",
	// 				"promotion_bonus_quantity": "40"
	// 				}, {
	// 				"promotion_id": "62",
	// 				"promotion_type": "range",
	// 				"promotion_bonus_item_id": "4",
	// 				"promotion_bonus_quantity": "30"
	// 				}, {
	// 				"promotion_id": "34",
	// 				"promotion_type": "package",
	// 				"discount_type": "value",
	// 				"discount_amount": "20",
	// 				"discount_percentage": ""
	// 				}]
	// 				};

	console.log('add items to sales cart data =====================',req.body);
	if(req.body.user_id != null && req.body.user_id != "" && req.body.item_id != null && req.body.item_id != "" && req.body.employee_id != null && req.body.employee_id != "" && req.body.customer_id != null && req.body.customer_id != "" && req.body.unit_id != null && req.body.unit_id != "" && req.body.quantity != null && req.body.quantity != "" && req.body.total_price != null && req.body.total_price != "" && req.body.total_price_before_tax != null && req.body.total_price_before_tax != "" && req.body.total_tax != null && req.body.total_tax != "" && req.body.tax_type != null && req.body.tax_type != "" && req.body.base_price_per_unit != null && req.body.base_price_per_unit != ""){
		console.log("input data >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",req.body);
		Models.SalesOrderCartDetail.findOne({
			where: {
				user_id: req.body.user_id,
				employee_id: req.body.employee_id,
				customer_id: req.body.customer_id,
				item_id: req.body.item_id,	
			}
			
		}).then(checkItem=>{
			console.log('checkItem >>>>>>>>>>>>>>>>>>>>');
			if(checkItem == null){
				console.log('checkItem if >>>>>>>>>>>>>>>>>>>>>>>>>');
				let create_sales = {};
				create_sales.user_id = req.body.user_id;
				create_sales.employee_id = req.body.employee_id;
				create_sales.customer_id = req.body.customer_id;
				create_sales.item_id = req.body.item_id;
				create_sales.unit_id = req.body.unit_id;
				create_sales.quantity = req.body.quantity;

				if(req.body.total_price_with_tax !="" && req.body.total_price_with_tax != null){
					create_sales.total_price_with_tax = req.body.total_price_with_tax;
				}else{
					create_sales.total_price_with_tax = 0;
				}

				create_sales.total_price = req.body.total_price;
				create_sales.total_price_before_tax = req.body.total_price_before_tax;
				create_sales.total_tax = req.body.total_tax;
				create_sales.tax_type = req.body.tax_type;
				create_sales.base_price_per_unit = req.body.base_price_per_unit;
				console.log('befor add >>>>>>>>>>>>>>>>>>>>');
				Models.SalesOrderCartDetail.create(create_sales).then(addedItem=>{
					if(addedItem){
						console.log(' added item >>>>>>>>>>>>>>>>'+addedItem.id);
						console.log('if added item >>>>>>>>>>>>>>>>');
						console.log('promotions data array >>>>>>>>>>>>>>>>',req.body.promotions_data);
						var promotions_data = [];
						if(!Array.isArray(req.body.promotions_data)){
							promotions_data = [req.body.promotions_data]
						}else{
							promotions_data = req.body.promotions_data
						}
						var created_promotions = {};

						if (promotions_data.length>0) {
							for (var i = 0; i < promotions_data.length; i++) {

								if(promotions_data[i].discount_percentage !="" && promotions_data[i].discount_percentage != null){
									promotions_data[i].discount_percentage = promotions_data[i].discount_percentage;
								}else{
									promotions_data[i].discount_percentage = 0;
								}

								if(promotions_data[i].discount_amount !="" && promotions_data[i].discount_amount != null){
									promotions_data[i].discount_amount = promotions_data[i].discount_amount;
								}else{
									promotions_data[i].discount_amount = 0;
								}

								if(promotions_data[i].discount_type !="" && promotions_data[i].discount_type != null){
									promotions_data[i].discount_type = promotions_data[i].discount_type;
								}else{
									promotions_data[i].discount_type = "NA";
								}

								if(promotions_data[i].promotion_bonus_item_id !="" && promotions_data[i].promotion_bonus_item_id != null){
									promotions_data[i].promotion_bonus_item_id =promotions_data[i].promotion_bonus_item_id;
								}else{
									promotions_data[i].promotion_bonus_item_id = null;
								}

								if(promotions_data[i].promotion_bonus_quantity !="" && promotions_data[i].promotion_bonus_quantity != null){
									promotions_data[i].promotion_bonus_quantity = promotions_data[i].promotion_bonus_quantity;
								}else{
									promotions_data[i].promotion_bonus_quantity = 0;
								}

								if(promotions_data[i].promotion_type !="" && promotions_data[i].promotion_type != null){
									promotions_data[i].promotion_type = promotions_data[i].promotion_type;
								}else{
									promotions_data[i].promotion_type = "NA"
								}

								if(promotions_data[i].promotion_id !="" && promotions_data[i].promotion_id != null){
									promotions_data[i].promotion_id = promotions_data[i].promotion_id;
								}else{
									promotions_data[i].promotion_id = null;
								}
								
								console.log('create promotion >>>>>>>>>>>>>>>'+addedItem.id);
								Models.SalesOrderCartPromotion.create({
									sales_order_cart_id:addedItem.id,
									discount_type:promotions_data[i].discount_type,
									promotion_id:promotions_data[i].promotion_id,
									promotion_type:promotions_data[i].promotion_type,
									discount_type:promotions_data[i].discount_type,
									discount_amount:promotions_data[i].discount_amount,
									discount_percentage:promotions_data[i].discount_percentage,
									promotion_bonus_item_id:promotions_data[i].promotion_bonus_item_id,
									promotion_bonus_quantity:promotions_data[i].promotion_bonus_quantity,
								}).then(addedPromotionsData => {
										created_promotions = addedPromotionsData;
										console.log('added promotions >>>>>>>>>>>>');
										res.end(JSON.stringify({
						                    response: 1,
						                    message: Messages['en'].SUCCESS_INSERT,
						                    // result: {addedItem,created_promotions}
						                }));
								}, error => {
									console.log('added promotions err',error);
									res.end(JSON.stringify({
					                        response: 0,
					                        message: Messages['en'].ERROR_CREATE
					                    }));
								})
								
							}
						}else{
							res.end(JSON.stringify({
			                    response: 1,
			                    message: Messages['en'].SUCCESS_INSERT,
			                    result: {addedItem,created_promotions}
			                }));
						}						
						console.log('promotions data array here >>>>>>>>>>>>>>>>',req.body.promotions_data);
					}else{
						console.log('else added item >>>>>>>>>>>>>>>>');
						res.end(JSON.stringify({
		                    response: 0,
		                    message: Messages['en'].ERROR_CREATE
		                }));
					}
				},err=>{
					console.log('cart_items', err)
					res.end(JSON.stringify({
		                    response: 0,
		                    message: Messages['en'].ERROR_CREATE
		                }));
				})
			}else{
				console.log('update else >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
				let update_sales = {};
				update_sales.unit_id = req.body.unit_id;
				update_sales.quantity = req.body.quantity;
				update_sales.base_price_per_unit = req.body.base_price_per_unit;

				update_sales.total_price = req.body.total_price;
				update_sales.total_price_before_tax = req.body.total_price_before_tax;
				update_sales.total_tax = req.body.total_tax;
				update_sales.tax_type = req.body.tax_type;

				if(req.body.total_price_with_tax !="" && req.body.total_price_with_tax != null){
					update_sales.total_price_with_tax =req.body.total_price_with_tax;
				}

				Models.SalesOrderCartDetail.update(update_sales,{
					where:{
						id:checkItem.id
					}
				}).then(addedItem=>{
					if(addedItem){
						console.log('item updated >>>>>>>>>>>>>>>>>>>>>>>>>>>');

						Models.SalesOrderCartPromotion.destroy({
							where: {
								sales_order_cart_id: checkItem.id,
							}
						}).then(delPromotions=>{
							console.log('old promotions deleted >>>>>>>>>>>>>>>>>>>>>');
							// res.end(JSON.stringify({
					  //                   response: 1,
					  //                   message: Messages['en'].SUCCESS_DELETE,
					  //                   result: delPromotions
					  //               }));
					  		console.log('now i m here ===================');
						  	var promotions_data = [];
							var created_promotions = {};
							if(!Array.isArray(req.body.promotions_data)){
								promotions_data = [req.body.promotions_data]
							}else{
								promotions_data = req.body.promotions_data
							}
							console.log('all promations array data ===============',promotions_data);
							if (promotions_data.length>0) {
								for (var i = 0; i < promotions_data.length; i++) {

									if(promotions_data[i].discount_percentage !="" && promotions_data[i].discount_percentage != null){
										promotions_data[i].discount_percentage = promotions_data[i].discount_percentage;
									}else{
										promotions_data[i].discount_percentage = 0;
									}

									if(promotions_data[i].discount_amount !="" && promotions_data[i].discount_amount != null){
										promotions_data[i].discount_amount = promotions_data[i].discount_amount;
									}else{
										promotions_data[i].discount_amount = 0;
									}

									if(promotions_data[i].discount_type !="" && promotions_data[i].discount_type != null){
										promotions_data[i].discount_type = promotions_data[i].discount_type;
									}else{
										promotions_data[i].discount_type = "NA";
									}

									if(promotions_data[i].promotion_bonus_item_id !="" && promotions_data[i].promotion_bonus_item_id != null){
										promotions_data[i].promotion_bonus_item_id =promotions_data[i].promotion_bonus_item_id;
									}else{
										promotions_data[i].promotion_bonus_item_id = null;
									}

									if(promotions_data[i].promotion_bonus_quantity !="" && promotions_data[i].promotion_bonus_quantity != null){
										promotions_data[i].promotion_bonus_quantity = promotions_data[i].promotion_bonus_quantity;
									}else{
										promotions_data[i].promotion_bonus_quantity = 0;
									}

									if(promotions_data[i].promotion_type !="" && promotions_data[i].promotion_type != null){
										promotions_data[i].promotion_type = promotions_data[i].promotion_type;
									}else{
										promotions_data[i].promotion_type = "NA"
									}

									if(promotions_data[i].promotion_id !="" && promotions_data[i].promotion_id != null){
										promotions_data[i].promotion_id = promotions_data[i].promotion_id;
									}else{
										promotions_data[i].promotion_id = null;
									}
									
									console.log('update promotion >>>>>>>>>>>>>>>'+checkItem.id);
									Models.SalesOrderCartPromotion.create({
										sales_order_cart_id:checkItem.id,
										discount_type:promotions_data[i].discount_type,
										promotion_id:promotions_data[i].promotion_id,
										promotion_type:promotions_data[i].promotion_type,
										discount_type:promotions_data[i].discount_type,
										discount_amount:promotions_data[i].discount_amount,
										discount_percentage:promotions_data[i].discount_percentage,
										promotion_bonus_item_id:promotions_data[i].promotion_bonus_item_id,
										promotion_bonus_quantity:promotions_data[i].promotion_bonus_quantity,
									}).then(addedPromotionsData => {
											created_promotions = addedPromotionsData;
											console.log('added promotions >>>>>>>>>>>>');
											res.end(JSON.stringify({
						                    response: 1,
						                    message: Messages['en'].SUCCESS_INSERT,
						                    // result: {addedItem,created_promotions}
						                }));
									}, error => {
										console.log('added promotions err',error);
										res.end(JSON.stringify({
						                        response: 0,
						                        message: Messages['en'].ERROR_CREATE
						                    }));
									})
									
								}
							}else{
								res.end(JSON.stringify({
				                    response: 1,
				                    message: Messages['en'].SUCCESS_INSERT,
				                    // result: {addedItem,created_promotions}
				                }));
							}
							

						},err=>{
							console.log('deleting cart item error',err);
							res.end(JSON.stringify({
				                    response: 0,
				                    message: Messages['en'].ERROR_FETCH
				                }));
						})

						

						// res.end(JSON.stringify({
			   //                  response: 1,
			   //                  message: Messages['en'].SUCCESS_INSERT,
			   //                  result: addedItem
			   //              }));
					}else{
						res.end(JSON.stringify({
		                    response: 0,
		                    message: Messages['en'].ERROR_CREATE
		                }));
					}
				},err=>{
					console.log('cart_items', err)
					res.end(JSON.stringify({
		                    response: 0,
		                    message: Messages['en'].ERROR_CREATE
		                }));
				})
			}
				
		}, error => {
			console.log('cart_items err >>>>>>>>>>>>>>>>>>>>>', error)
				res.end(JSON.stringify({
	                    response: 0,
	                    message: Messages['en'].ERROR_CREATE
	                }));
		})
	}else{
		res.end(JSON.stringify({
                response: 2,
                message: Messages['en'].WRONG_DATA
            }));
	}
}

exports.sales_cart_items_list = function(req, res){
	// req.body = {"user_id":"7","employee_id":"13","customer_id":"88","price_list_id":"2"};
	console.log("req body >>>>>>>>>>>>>>>>>>.."+req.body);
	if(req.body.user_id != '' && req.body.user_id != null && req.body.employee_id != '' && req.body.employee_id != null && req.body.customer_id != '' && req.body.customer_id != null && req.body.price_list_id != '' && req.body.price_list_id != null){
		console.log('if ------------------------!!!');
		Models.SalesOrderCartDetail.findAll({
			where: {
				user_id: req.body.user_id,
				employee_id: req.body.employee_id,
				customer_id: req.body.customer_id
			},
			include: [
				{
					model: Models.Items,
					as: 'item_detail_in_sales_cart',
					include: [
						{
							model: Models.ItemUnitConversion,
							as: 'item_measurement_units',
							include:[{
								model:Models.MeasurementUnit,
								as:'measurement_unit_in_unit_conversion',
								required:false
							}]
						},{
							model: Models.priceListItems,
							as: 'price_list',
							where: {
								price_list_id: req.body.price_list_id
							},
							required: false,
							include: [
								{
									model: Models.ItemPriceLists,
									as:'items_price_lists',
									required: true
								}
							]
						}
					]
				},
				{
					model: Models.MeasurementUnit,
					as: 'measurement_unit_in_sales_cart'
				},
				// {
				// 	model: Models.Promotions,
				// 	as: 'promotions_in_sales_cart_items'
				// }
				{
					model: Models.SalesOrderCartPromotion,
					as: 'promotions_in_sales_cart_details',
					include: [
						{
							model: Models.Promotions,
							as: 'sales_cart_promotion_details',
							attributes: ['id','name','promotion_type','start_date_time','end_date_time','valid_for','status'],
						}
					]
				},
			]
		}).then(cartItems=>{
			if(cartItems){
				console.log('cartItems data >>>>>>>>>>>>>>>>>>>>>>'+cartItems);
				res.end(JSON.stringify({
	                    response: 1,
	                    message: Messages['en'].SUCCESS_FETCH,
	                    result: cartItems
	                }));
			}else{
				res.end(JSON.stringify({
                    response: 0,
                    message: Messages['en'].ERROR_FETCH
                }));
			}
		},err=>{
			console.log('cart_items >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', err)
			res.end(JSON.stringify({
                    response: 0,
                    message: Messages['en'].ERROR_FETCH
                }));
		})
	}else{
		console.log('else ------------------------!!!');
		res.end(JSON.stringify({
            response: 2,
            message: Messages['en'].WRONG_DATA
        }));
	}
}

exports.delete_sales_cart_items = function(req, res){
	if(req.body.user_id != '' && req.body.user_id != null && req.body.cart_item_id != '' && req.body.cart_item_id != null && req.body.employee_id != '' && req.body.employee_id != null && req.body.customer_id != '' && req.body.customer_id != null){
		Models.SalesOrderCartDetail.destroy({
			where: {
				id: req.body.cart_item_id,
				user_id: req.body.user_id,
				employee_id: req.body.employee_id,
				customer_id: req.body.customer_id,
			}
		}).then(item=>{
			res.end(JSON.stringify({
	                    response: 1,
	                    message: Messages['en'].SUCCESS_DELETE,
	                    result: item
	                }));
		},err=>{
			console.log('deleting cart item error',err);
			res.end(JSON.stringify({
                    response: 0,
                    message: Messages['en'].ERROR_FETCH
                }));
		})
	}else{
		res.end(JSON.stringify({
            response: 2,
            message: Messages['en'].WRONG_DATA
        }));
	}
}


exports.all_items_according_customer_price = function(req, res){
	if(req.body.user_id != "" && req.body.user_id != null && req.body.employee_id != "" && req.body.employee_id != null && req.body.price_list_id != "" && req.body.price_list_id != null){
		Models.EmployeeAssignItems.findAll({
			where: {
				user_id: req.body.user_id,
				employee_id: req.body.employee_id,
				status: 'active'
			}
		}).then(items=>{
			if(items.length>0){
				var item_ids = items.map(function(value) {
                    return value.item_id;
                });	
				var filter={};
				// filter
				if(req.body.order_by != "" && req.body.order_by != null && req.body.order_type != "" && req.body.order_type != null){
					if(req.body.order_type == 'asc' || req.body.order_type == 'desc'){
						let order = [];
						order.push(req.body.order_by);
						order.push(req.body.order_type);
						filter.order = [order];
					}
				}
				let where_query = {};
				if((req.body.category_id != "" && req.body.category_id != null) || (req.body.sub_category_id != "" && req.body.sub_category_id != null)){
					console.log('stage 1----')
					// let where_query = {};
					if(req.body.category_id != "" && req.body.category_id != null){
						console.log('stage 2----category_id')
						where_query.category_id = req.body.category_id;
					}

					if(req.body.sub_category_id != "" && req.body.sub_category_id != null){
						console.log('stage 2----subcategory_id')
						where_query.sub_category_id = req.body.sub_category_id;
					}

					where_query.user_id = req.body.user_id;
					where_query.id = {[Op.in]: item_ids}
					console.log('where_query',where_query)
					filter.where = where_query
				}else{
					// filter.where = {user_id:req.body.user_id}
					where_query.user_id = req.body.user_id;
					where_query.id = {[Op.in]: item_ids}
					filter.where = where_query
				}

				filter.include = [
									{
										model:Models.ItemUnitConversion,
										as:'item_measurement_units',
										include:[{
											model:Models.MeasurementUnit,
											as:'measurement_unit_in_unit_conversion',
										}]	
									},
									{
										model: Models.priceListItems,
										as: 'price_list',
										where: {
											price_list_id: req.body.price_list_id
										},
										required: false,
										include: [
											{
												model: Models.ItemPriceLists,
												as:'items_price_lists',
												required: true
											}
										]
									}
								],
				console.log('filter-- >',filter);
				Models.Items.findAll(
									filter
									).then(itemsList => {
					if(itemsList.length > 0){
						res.end(JSON.stringify({
			            	        response: 1,
			                	    message: Messages['en'].SUCCESS_FETCH,
			                    	result: itemsList
			                	}));
					}else{
						res.end(JSON.stringify({
					                            response: 3,
					                            message: Messages['en'].EMPTY_DATA
					                        }));
					}
				},error => {
					console.log('all_items_list error == -- --  - - ', error)
					res.end(JSON.stringify({
			                    response: 0,
			                    message: Messages['en'].ERROR_FETCH
			                }));
				})

			}else{
				res.end(JSON.stringify({
                    response: 3,
                    message: Messages['en'].EMPTY_DATA
                }));
			}
			
		},err=>{
			console.log('error == -- --  - - ', err)
			res.end(JSON.stringify({
                response: 0,
                message: Messages['en'].ERROR_FETCH
            }));
		})
		// Models.Items.findAll({
		// 	include:[
		// 		{
		// 			model: Models.priceListItems,
		// 			as: 'price_list',
		// 			include: [
		// 				{
		// 					model: Models.ItemPriceLists,
		// 					as:'items_price_lists',
		// 					required: true
		// 				}
		// 			]
		// 		}
		// 	]
		// }).then(items=>{
		// 	if(items.length>0){
		// 		res.end(JSON.stringify({
  //                   response: 1,
  //                   message: Messages['en'].SUCCESS_FETCH,
  //                   result: items
  //               }));
		// 	}else{
		// 		res.end(JSON.stringify({
  //                   response: 0,
  //                   message: Messages['en'].ERROR_FETCH
  //               }));
		// 	}
		// })
	}else{
		res.end(JSON.stringify({
            response: 2,
            message: Messages['en'].WRONG_DATA
        }));
	}
}


exports.edit_sales_cart_items = function(req, res){
	console.log(req.body)
	if(req.body.user_id != null && req.body.user_id != "" && req.body.item_id != null && req.body.item_id != "" && req.body.employee_id != null && req.body.employee_id != "" && req.body.customer_id != null && req.body.customer_id != "" && req.body.unit_id != null && req.body.unit_id != "" && req.body.quantity != null && req.body.quantity != "" && req.body.total_price != null && req.body.total_price != ""){
		
		Models.SalesOrderCartDetail.findOne({
			where: {
				user_id: req.body.user_id,
				employee_id: req.body.employee_id,
				customer_id: req.body.customer_id,
				item_id: req.body.item_id,	
			}
		}).then(checkItem=>{
			if(checkItem){
				checkItem.update({
					unit_id: req.body.unit_id,
					quantity: req.body.quantity,
					discount_percentage: req.body.discount_percentage,
					discount_amount: req.body.discount_amount,
					total_price: req.body.total_price,
				}).then(addedItem=>{
					if(addedItem){
						res.end(JSON.stringify({
			                    response: 1,
			                    message: Messages['en'].SUCCESS_UPDATE,
			                    result: addedItem
			                }));
					}else{
						res.end(JSON.stringify({
		                    response: 0,
		                    message: Messages['en'].ERROR_CREATE
		                }));
					}
				},err=>{
					console.log('cart_items', err)
					res.end(JSON.stringify({
		                    response: 0,
		                    message: Messages['en'].ERROR_CREATE
		                }));
				})
			}else{
				res.end(JSON.stringify({
	                response: 3,
	                message: Messages['en'].EMPTY_DATA
	            }));
			}
				
		}, error => {
			console.log('cart_items err', error)
				res.end(JSON.stringify({
	                    response: 0,
	                    message: Messages['en'].ERROR_CREATE
	                }));
		})
	}else{
		res.end(JSON.stringify({
                response: 2,
                message: Messages['en'].WRONG_DATA
            }));
	}
}

exports.start_end_employee_journey = function(req, res){
	if(req.body.employee_id != "" && req.body.employee_id != null && req.body.user_id != "" && req.body.user_id != null && req.body.current_date_time != "" && req.body.current_date_time != null && req.body.current_journey_status != "" && req.body.current_journey_status != null){
		var employee_id = req.body.employee_id,
			user_id = req.body.user_id,
			current_date_time = req.body.current_date_time,
			current_journey_status = req.body.current_journey_status;

		if(current_journey_status == 'started'){
			Models.EmployeeJourneys.findOne({
				where:{
					employee_id:employee_id,
					current_journey_status:'started'
				}
			}).then(employeeCheck => {
				if(employeeCheck !=  null){
					res.end(JSON.stringify({
	                            response: 4,
	                            message: Messages['en'].VISIT_ALREADY_RUNNING,
	                            result: employeeCheck
	                        }));
				}else{
					if(req.body.battery_life != "" && req.body.battery_life != null && req.body.android_version != "" && req.body.android_version != null && req.body.latitude != "" && req.body.latitude != null && req.body.longitude != "" && req.body.longitude != null){
						Models.EmployeeJourneys.create({
							employee_id:employee_id,
							user_id:user_id,
							start_date_time:current_date_time,
							battery_life:req.body.battery_life,
							android_version:req.body.android_version,
							latitude:req.body.latitude,
							longitude:req.body.longitude,
							current_journey_status:current_journey_status
						}).then(employeeJourneyInsert => {
							res.end(JSON.stringify({
			                            response: 1,
			                            message: Messages['en'].SUCCESS_INSERT,
			                            result: employeeJourneyInsert
			                        }));
						},error => {
							res.end(JSON.stringify({
				                        response: 2,
				                        message: Messages['en'].WRONG_DATA
				                    }));
						})
					}else{
						res.end(JSON.stringify({
		                            response: 2,
		                            message: Messages['en'].WRONG_DATA
		                        }));
					}
				}
			}, error => {
				console.log('error',error)
				res.end(JSON.stringify({
	                        response: 2,
	                        message: Messages['en'].WRONG_DATA
	                    }));	
			})
		}else if(current_journey_status == 'ended'){
			if(req.body.journey_id != null && req.body.journey_id != ""){
				Models.EmployeeJourneys.update({
					end_date_time:current_date_time,
					current_journey_status:current_journey_status
				},{
					where:{
						id:req.body.journey_id						
					}
				}).then(employeeJourneyUpdate => {
					res.end(JSON.stringify({
	                            response: 1,
	                            message: Messages['en'].SUCCESS_UPDATE,
	                            result: employeeJourneyUpdate
	                        }));
				},error => {
					res.end(JSON.stringify({
		                        response: 0,
		                        message: Messages['en'].ERROR_FETCH
		                    }));
				})
			}else{
				res.end(JSON.stringify({
                            response: 2,
                            message: Messages['en'].WRONG_DATA
                        }));
			}
		}else{
			res.end(JSON.stringify({
                        response: 5,
                        message: Messages['en'].WRONG_STATUS
                    }));
		}
	}else{
		res.end(JSON.stringify({
                    response: 2,
                    message: Messages['en'].WRONG_DATA
                }));	
	}
}

exports.sales_order_request_submit = function(req, res){

	var sale_req_detail;
	var cart_data;
	var promotions_data;
	console.log('sales order request submit ===========');
	// req.body = {
	// 			"user_id": "7",
	// 			"employee_id": "13",
	// 			"store_id": "25",
	// 			"customer_id": "88",
	// 			"supervisor_id": "19",
	// 			"total_price_without_tax_discount": 2400,
	// 			"total_tax": 60,
	// 			"total_discount": 1200,
	// 			"total_price": 1260,
	//          "request_type":"invoice"
	// 			"level": "2",
	// 			"salesmanager_id": "16",
	// 			"sales_order_arr": [{
	// 			"item_id": 4,
	// 			"measurement_unit_id": 23,
	// 			"quantity": 30,
	// 			"total_price": "315.0",
	// 			"total_tax": "15.0",
	// 			"total_price_with_tax": "315.0",
	// 			"total_price_before_tax": 900,
	// 			"tax_type": "percentage",
	// 			"base_price_per_unit": "30",
	// 			"sales_order_promotions_arr": [{
	// 			"promotion_id": "34",
	// 			"promotion_type": "package",
	// 			"discount_type": "value",
	// 			"discount_amount": "20",
	// 			"discount_percentage": ""
	// 			}]
	// 			}, {
	// 			"item_id": 1,
	// 			"measurement_unit_id": 23,
	// 			"quantity": 30,
	// 			"total_price": "945.0",
	// 			"total_tax": "45.0",
	// 			"total_price_with_tax": "945.0",
	// 			"total_price_before_tax": 1500,
	// 			"tax_type": "percentage",
	// 			"base_price_per_unit": "50",
	// 			"sales_order_promotions_arr": [{
	// 			"promotion_id": "62",
	// 			"promotion_type": "range",
	// 			"promotion_bonus_item_id": "70",
	// 			"promotion_bonus_quantity": "20",
	// 			"measurement_unit_id": '23',
	// 			}, {
	// 			"promotion_id": "62",
	// 			"promotion_type": "range",
	// 			"promotion_bonus_item_id": "68",
	// 			"promotion_bonus_quantity": "30",
	// 			"measurement_unit_id": '23',
	// 			}, {
	// 			"promotion_id": "62",
	// 			"promotion_type": "range",
	// 			"promotion_bonus_item_id": "71",
	// 			"promotion_bonus_quantity": "30",
	// 			"measurement_unit_id": '23',
	// 			}, {
	// 			"promotion_id": "76",
	// 			"promotion_type": "range",
	// 			"promotion_bonus_item_id": "59",
	// 			"promotion_bonus_quantity": "40",
	// 			"measurement_unit_id": '23',
	// 			}, {
	// 			"promotion_id": "34",
	// 			"promotion_type": "package",
	// 			"discount_type": "value",
	// 			"discount_amount": "20",
	// 			"discount_percentage": "",
	// 			"measurement_unit_id": '23',
	// 			}]
	// 			}]
	// 			};
	console.log(req.body);

	if(req.body.sales_order_arr && req.body.user_id != "" && req.body.user_id != null && req.body.employee_id != "" && req.body.employee_id != null && req.body.customer_id != "" && req.body.customer_id != null && req.body.supervisor_id != "" && req.body.supervisor_id != null && req.body.store_id != "" && req.body.store_id != null && req.body.level != "" && req.body.level != null){
		var sales_order_arr = [];

		if(!Array.isArray(req.body.sales_order_arr)){
			sales_order_arr = [req.body.sales_order_arr]
		}else{
			sales_order_arr = req.body.sales_order_arr
		}

		let create_sales = {};

		create_sales.user_id=req.body.user_id;
		create_sales.request_level=req.body.level;
		create_sales.employee_id=req.body.employee_id;
		create_sales.customer_id=req.body.customer_id;
		create_sales.store_id=req.body.store_id;
		create_sales.supervisor_id=req.body.supervisor_id;
		create_sales.no_of_items=sales_order_arr.length;

		if(req.body.level > 1 && (req.body.salesmanager_id == null || req.body.salesmanager_id == "")){
			res.end(JSON.stringify({
	                    response: 2,
	                    message: Messages['en'].WRONG_DATA
	                }));
		}else if(req.body.level > 1){
			create_sales.salesmanager_id=req.body.salesmanager_id;
			create_sales.salesmanager_status='pending';
		}

		create_sales.total_price_without_tax_discount = req.body.total_price_without_tax_discount;
		create_sales.total_tax = req.body.total_tax;
		create_sales.total_discount = req.body.total_discount;
		create_sales.total_price = req.body.total_price;

		Models.SalesOrderRequest.create(create_sales).then(async salesOrderRequest => {
			if(salesOrderRequest.id){
				console.log('q step 1 sales order request id',salesOrderRequest.id);
				let request_id = salesOrderRequest.id;
				var sales_order_arr_quantity = "true";

				// for(var k = 0; k < sales_order_arr.length; k++) {
					
				// 	if(sales_order_arr[i].item_id && sales_order_arr[i].measurement_unit_id && sales_order_arr[i].quantity){

				// 		if (req.body.request_type=="invoice") {
				// 			Models.StockItems.findOne({
				// 				where:{
				// 					user_id:req.body.user_id,
				// 					store_id:req.body.store_id,
				// 					item_id:sales_order_arr[i].item_id,
				// 					measurement_unit_id:sales_order_arr[i].measurement_unit_id,
				// 				}
				// 			}).then(stockItemData =>{
				// 				if (stockItemData.quantity>=sales_order_arr[i].quantity) {
				// 					sales_order_arr_quantity = "true";
				// 				}else{
				// 					sales_order_arr_quantity = "false";									
				// 				}
				// 			},error =>{
				// 				res.end(JSON.stringify({
			 //                        response: 0,
			 //                        message: Messages['en'].ERROR_FETCH
			 //                    }));
				// 			})
				// 		}

				// 		if (sale_req_detail.sales_order_promotions_arr.length>0) {
				// 			console.log('if promo data  -----------------------------',sale_req_detail.sales_order_promotions_arr);
				// 			for (var l = 0; l < sale_req_detail.sales_order_promotions_arr.length; l++) {

				// 			}
				// 		}
				// 	}
				// }

				for (var i = 0; i < sales_order_arr.length; i++) {
					console.log('q step 2');
					if(sales_order_arr[i].item_id && sales_order_arr[i].measurement_unit_id && sales_order_arr[i].quantity){
						console.log('q step 3');
						let create_sales_req = {};
						sale_req_detail = sales_order_arr[i];
						create_sales_req.user_id = req.body.user_id;
						create_sales_req.employee_id = req.body.employee_id;
						create_sales_req.customer_id = req.body.customer_id;
						create_sales_req.store_id = req.body.store_id;
						create_sales_req.sales_manager_id = req.body.sales_manager_id;
						create_sales_req.item_id = sales_order_arr[i].item_id;
						create_sales_req.sales_order_request_id = request_id;
						create_sales_req.measurement_unit_id = sales_order_arr[i].measurement_unit_id;
						create_sales_req.quantity = sales_order_arr[i].quantity;
						create_sales_req.base_price_per_unit = sales_order_arr[i].base_price_per_unit;
						
						// if(sales_order_arr[i].discount_percentage != "" && sales_order_arr[i].discount_percentage != null){
						// 	create_sales_req.discount_percentage =  sales_order_arr[i].discount_percentage;
						// }

						// if(sales_order_arr[i].discount_amount != "" && sales_order_arr[i].discount_amount != null){
						// 	create_sales_req.discount_amount =  sales_order_arr[i].discount_amount;
						// }

						create_sales_req.total_price =  sales_order_arr[i].total_price;
						create_sales_req.total_price_before_tax =  sales_order_arr[i].total_price_before_tax;
						create_sales_req.total_tax =  sales_order_arr[i].total_tax;
						create_sales_req.tax_type =  sales_order_arr[i].tax_type;

						if(sales_order_arr[i].total_price_with_tax != null && sales_order_arr[i].total_price_with_tax != ""){
							create_sales_req.total_price_with_tax = sales_order_arr[i].total_price_with_tax;
						}

						// if(sales_order_arr[i].promotion_id != null && sales_order_arr[i].promotion_id != ""){
						// 	create_sales_req.promotion_id = sales_order_arr[i].promotion_id;
						// }

						// if(sales_order_arr[i].promotion_type != null && sales_order_arr[i].promotion_type != ""){
						// 	create_sales_req.promotion_type = sales_order_arr[i].promotion_type;
						// }

						// if(sales_order_arr[i].promotion_bonus_item_id != null && sales_order_arr[i].promotion_bonus_item_id != ""){
						// 	create_sales_req.promotion_bonus_item_id = sales_order_arr[i].promotion_bonus_item_id;
						// }

						// if(sales_order_arr[i].promotion_bonus_quantity != null && sales_order_arr[i].promotion_bonus_quantity != ""){
						// 	create_sales_req.promotion_bonus_quantity = sales_order_arr[i].promotion_bonus_quantity;
						// }
						// console.log('sale_req_detail====================',sale_req_detail);
						console.log('prom length====================',sale_req_detail.sales_order_promotions_arr.length);

						if (req.body.request_type=="invoice") {
							Models.StockItems.findOne({
								where:{
									user_id:req.body.user_id,
									store_id:req.body.store_id,
									item_id:sales_order_arr[i].item_id,
									measurement_unit_id:sales_order_arr[i].measurement_unit_id,
								}
							}).then(stockItemData =>{
								if (stockItemData.quantity>=sales_order_arr[i].quantity) {
									var remain_quantity = stockItemData.quantity-sales_order_arr[i].quantity;
									Models.StockItems.update({
										quantity:remain_quantity
									},{
										where:{
											user_id:req.body.user_id,
											store_id:req.body.store_id,
											item_id:sales_order_arr[i].item_id,
											measurement_unit_id:sales_order_arr[i].measurement_unit_id,
										}
									}).then(updatedStockItemQuantity =>{
										console.log("stock item quantity updated ==================");
									},error => {
										console.log("error in stock item quantity update ==================");
									})
								}else{
									console.log('maximum quantity exceeded');
									res.end(JSON.stringify({
					                    response: 2,
					                    message: Messages['en'].WRONG_DATA
					                }));
								}
							},error =>{
								res.end(JSON.stringify({
			                        response: 0,
			                        message: Messages['en'].ERROR_FETCH
			                    }));
							})
						}

						await Models.SalesOrderRequestDetail.create(create_sales_req).then(async requestData => {
							console.log('add requestData id --- ---- ---- --- -- - - - -',requestData.id);

							if (sale_req_detail.sales_order_promotions_arr.length>0) {
								console.log('if promo data  -----------------------------',sale_req_detail.sales_order_promotions_arr);
								for (var j = 0; j < sale_req_detail.sales_order_promotions_arr.length; j++) {
									// promotions_data = "";
									promotions_data = sale_req_detail.sales_order_promotions_arr;
									console.log('promotions data ----------------------------',promotions_data);
									if(promotions_data[j].discount_percentage !="" && promotions_data[j].discount_percentage != null){
										promotions_data[j].discount_percentage = promotions_data[j].discount_percentage;
									}else{
										promotions_data[j].discount_percentage = 0;
									}

									if(promotions_data[j].discount_amount !="" && promotions_data[j].discount_amount != null){
										promotions_data[j].discount_amount = promotions_data[j].discount_amount;
									}else{
										promotions_data[j].discount_amount = 0;
									}

									if(promotions_data[j].discount_type !="" && promotions_data[j].discount_type != null){
										promotions_data[j].discount_type = promotions_data[j].discount_type;
									}else{
										promotions_data[j].discount_type = "NA";
									}

									if(promotions_data[j].promotion_bonus_item_id !="" && promotions_data[j].promotion_bonus_item_id != null){
										promotions_data[j].promotion_bonus_item_id =promotions_data[j].promotion_bonus_item_id;
									}else{
										promotions_data[j].promotion_bonus_item_id = null;
									}

									if(promotions_data[j].promotion_bonus_quantity !="" && promotions_data[j].promotion_bonus_quantity != null){
										promotions_data[j].promotion_bonus_quantity = promotions_data[j].promotion_bonus_quantity;
									}else{
										promotions_data[j].promotion_bonus_quantity = 0;
									}

									if(promotions_data[j].promotion_type !="" && promotions_data[j].promotion_type != null){
										promotions_data[j].promotion_type = promotions_data[j].promotion_type;
									}else{
										promotions_data[j].promotion_type = "NA"
									}

									if(promotions_data[j].measurement_unit_id !="" && promotions_data[j].measurement_unit_id != null){
										promotions_data[j].measurement_unit_id = promotions_data[j].measurement_unit_id;
									}else{
										promotions_data[j].measurement_unit_id = null
									}

									if(promotions_data[j].promotion_id !="" && promotions_data[j].promotion_id != null){
										promotions_data[j].promotion_id = promotions_data[j].promotion_id;
									}else{
										promotions_data[j].promotion_id = null;
									}

									if (req.body.request_type=="invoice") {
										await Models.StockItems.findOne({
											where:{
												user_id:req.body.user_id,
												store_id:req.body.store_id,
												item_id:promotions_data[j].promotion_bonus_item_id,
												measurement_unit_id:promotions_data[j].measurement_unit_id,
											}
										}).then(async stockItemData =>{

											if (stockItemData.quantity>=sales_order_arr[i].quantity) {
												var remain_quantity = stockItemData.quantity-promotions_data[j].promotion_bonus_quantity;
												await Models.StockItems.update({
													quantity:remain_quantity
												},{
													where:{
														user_id:req.body.user_id,
														store_id:req.body.store_id,
														item_id:promotions_data[j].promotion_bonus_item_id,
														measurement_unit_id:promotions_data[j].measurement_unit_id,
													}
												}).then(async updatedStockItemQuantity =>{
													console.log("promotion stock item quantity updated ==================");
												},error => {
													console.log("error in promotion stock item quantity update ==================");
												})
											}else{
												console.log('promotion maximum quantity exceeded');
												res.end(JSON.stringify({
								                    response: 2,
								                    message: Messages['en'].WRONG_DATA
								                }));
											}
										},error =>{
											res.end(JSON.stringify({
						                        response: 0,
						                        message: Messages['en'].ERROR_FETCH
						                    }));
										})
									}
									
									console.log('create promotion gggc >>>>>>>>>>>>>>>'+requestData.id);
									await Models.SalesOrderRequestDetailPromotion.create({
										sales_order_request_detail_id:requestData.id,
										discount_type:promotions_data[j].discount_type,
										promotion_id:promotions_data[j].promotion_id,
										promotion_type:promotions_data[j].promotion_type,
										discount_type:promotions_data[j].discount_type,
										discount_amount:promotions_data[j].discount_amount,
										discount_percentage:promotions_data[j].discount_percentage,
										promotion_bonus_item_id:promotions_data[j].promotion_bonus_item_id,
										promotion_bonus_quantity:promotions_data[j].promotion_bonus_quantity,
										measurement_unit_id:promotions_data[j].measurement_unit_id,
									}).then(async addedPromotionsData => {

										Models.SalesOrderCartDetail.findAll({
											where:{
													user_id:req.body.user_id,
													employee_id:req.body.employee_id,
													customer_id:req.body.customer_id,
													item_id:requestData.item_id
											}
										}).then(cartData=>{
											console.log('cart data ------------------',cartData);
											if (cartData!=null) {
												for (var k = 0; k < cartData.length; k++) {
													cart_data = cartData[k]; 
													Models.SalesOrderCartPromotion.destroy({
														where:{
															sales_order_cart_id:cart_data.id,
														}
													}).then(destPromo => {
														console.log('cart promotions deleted Successfully -----------------',destPromo);
														Models.SalesOrderCartDetail.destroy({
															where:{
																user_id:req.body.user_id,
																employee_id:req.body.employee_id,
																customer_id:req.body.customer_id,
																item_id:requestData.item_id
																// id:cart_data.id,
															}
														}).then(destCart => {
															console.log('cart detail deleted Successfully -----------------',destCart);
															
														},err => {
															console.log('**!!!! error in destroy sales order request detail !!!!**', error);
														});
													},err => {
														console.log('**!!!! error in destroy sales order request detail !!!!**', error);
													});
												}												
											}else{
												res.end(JSON.stringify({
						                            response: 1,
						                            message: Messages['en'].SUCCESS_INSERT
						                        }));
											}											
											
										},error=>{
											res.end(JSON.stringify({
						                        response: 0,
						                        message: Messages['en'].ERROR_FETCH
						                    }));
										})
											// console.log('added promotions >>>>>>>>>>>>');
											// res.end(JSON.stringify({
							    //                 response: 1,
							    //                 message: Messages['en'].SUCCESS_INSERT,
							    //             }));
									}, error => {
										console.log('added promotions err',error);
										res.end(JSON.stringify({
						                        response: 0,
						                        message: Messages['en'].ERROR_CREATE
						                    }));
									})
								}
							}else{
								Models.SalesOrderCartDetail.findAll({
									where:{
											user_id:req.body.user_id,
											employee_id:req.body.employee_id,
											customer_id:req.body.customer_id,
											item_id:requestData.item_id
									}
								}).then(cartData=>{
									console.log('cart data ------------------',cartData);
									if (cartData!=null) {
										for (var k = 0; k < cartData.length; k++) {
											cart_data = cartData[k]; 
											Models.SalesOrderCartPromotion.destroy({
												where:{
													sales_order_cart_id:cart_data.id,
												}
											}).then(destPromo => {
												console.log('cart promotions deleted Successfully -----------------',destPromo);
												Models.SalesOrderCartDetail.destroy({
													where:{
														user_id:req.body.user_id,
														employee_id:req.body.employee_id,
														customer_id:req.body.customer_id,
														item_id:requestData.item_id
														// id:cart_data.id,
													}
												}).then(destCart => {
													console.log('cart detail deleted Successfully -----------------',destCart);
													
												},err => {
													console.log('**!!!! error in destroy sales order request detail !!!!**', error);
												});
											},err => {
												console.log('**!!!! error in destroy sales order request detail !!!!**', error);
											});
										}												
									}else{
										res.end(JSON.stringify({
				                            response: 1,
				                            message: Messages['en'].SUCCESS_INSERT
				                        }));
									}											
									
								},error=>{
									res.end(JSON.stringify({
				                        response: 0,
				                        message: Messages['en'].ERROR_FETCH
				                    }));
								})
							}							
							
							// Models.SalesOrderCartDetail.destroy({
							// 	where:{
							// 		user_id:req.body.user_id,
							// 		employee_id:req.body.employee_id,
							// 		customer_id:req.body.customer_id,
							// 		item_id:requestData.item_id
							// 	}
							// }).then(destCart => {

							// },err => {
							// 	console.log('**!!!! error in destroy sales order request detail !!!!**', error);
							// });
						}, error => {
							console.log('********** error in sales order request detail add ************', error);
							res.end(JSON.stringify({
			                        response: 0,
			                        message: Messages['en'].ERROR_CREATE
			                    }));
						})

					}else{
						console.log('***** Warning: Wrong data or format *****')
					}

					if(sales_order_arr.length - 1 == i ){
						
						res.end(JSON.stringify({
		                            response: 1,
		                            message: Messages['en'].SUCCESS_INSERT
		                        }));
					}
				}
			}else{
				res.end(JSON.stringify({
			                        response: 0,
			                        message: Messages['en'].ERROR_CREATE
			                    }));
			}
		},err => {
			res.end(JSON.stringify({
			                        response: 0,
			                        message: Messages['en'].ERROR_CREATE
			                    }));
		})
	}else{
		res.end(JSON.stringify({
                    response: 2,
                    message: Messages['en'].WRONG_DATA
                }));
	}
}

exports.sales_order_cart_remove_item = function(req, res){
	if(req.body.user_id != "" && req.body.user_id != null && req.body.employee_id != "" && req.body.employee_id != null && req.body.customer_id != "" && req.body.customer_id != null && req.body.cart_id != "" && req.body.cart_id != null){
		Models.SalesOrderCartDetail.findOne({
			where:{
				user_id:req.body.user_id,
				employee_id:req.body.employee_id,
				customer_id:req.body.customer_id,
				cart_id:requestData.cart_id
			}
		}).then(salesCartRemove => {
			if(salesCartRemove != null){
				salesCartRemove.destroy().then(respDestroy => {
					res.end(JSON.stringify({
			                        response: 1,
			                        message: Messages['en'].SUCCESS_DELETE,
			                        result: respDestroy
			                    }));	
				},err => {
					res.end(JSON.stringify({
			                        response: 0,
			                        message: Messages['en'].ERROR_DELETE
			                    }));		
				})
			}else{
				res.end(JSON.stringify({
			                        response: 3,
			                        message: Messages['en'].EMPTY_DATA
			                    }));
			}
		},error => {
			res.end(JSON.stringify({
		                        response: 0,
		                        message: Messages['en'].ERROR_DELETE
		                    }));
		})
	}else{
		res.end(JSON.stringify({
                    response: 2,
                    message: Messages['en'].WRONG_DATA
                }));
	}
}

exports.get_request_levels = function(req, res){
	if(req.body.user_id != null && req.body.user_id != "" && req.body.req_type != null && req.body.req_type != ""){
		Models.RequestLevelControls.findOne({
			where:{
				user_id:req.body.user_id,
				request_type:req.body.req_type
			}
		}).then(levels => {
			if(levels != null){
				res.end(JSON.stringify({
			                        response: 1,
			                        message: Messages['en'].SUCCESS_FETCH,
			                        result: levels
			                    }));
			}else{
				res.end(JSON.stringify({
			                        response: 3,
			                        message: Messages['en'].EMPTY_DATA,
			                        result: levels
			                    }));
			}
		},error => {
			console.log('error in level fetch ',error);
			res.end(JSON.stringify({
		                        response: 0,
		                        message: Messages['en'].ERROR_FETCH
		                    }));
		})
	}else{
		res.end(JSON.stringify({
                    response: 2,
                    message: Messages['en'].WRONG_DATA
                }));	
	}
}

exports.get_sales_order_requests_list = function(req, res){
	if(req.body.user_id != "" && req.body.user_id != null){
		let where_cond = {};
		where_cond.user_id = req.body.user_id;

		if(req.body.supervisor_id != "" && req.body.supervisor_id != null){
			where_cond.supervisor_id = req.body.supervisor_id;
		}

		if(req.body.salesmanager_id != "" && req.body.salesmanager_id != null){
			where_cond.salesmanager_id = req.body.salesmanager_id;
			where_cond.supervisor_status = 'accepted';
		}

		if(req.body.super_filter_status && req.body.super_filter_status != ""){
			where_cond.supervisor_status = req.body.super_filter_status;
		}

		if(req.body.sales_filter_status && req.body.sales_filter_status != ""){
			where_cond.salesmanager_status = req.body.sales_filter_status;
		}

		if(req.body.store_id && req.body.store_id != ""){
			where_cond.store_id = req.body.store_id;
		}

		if(req.body.salesman_id && req.body.salesman_id != ""){
			where_cond.employee_id = req.body.salesman_id;
		}

		if(req.body.sales_request_id && req.body.sales_request_id != ""){
			where_cond.id = req.body.sales_request_id;
		}
		console.log('stage 1');

		Models.SalesOrderRequest.findAll({
			where:where_cond,
			include:[
			{
				model:Models.Employees,
				as:'employee_detail_in_sales_order_request',
				attributes: { 
					include:['id','user_id','employee_name_en','employee_name_ar','phone_no','username']
				}
			},{
				model:Models.Stores,
				as:'store_detail_in_sales_order_request',
				attributes: { 
					include:['id', 'user_id', 'store_number', 'store_name_en', 'store_name_ar', 'reference', 'note', 'status']
				}
			}],
			order: [
            	['id', 'DESC']
        	],
		}).then(salesOrderRequests => {
			if(salesOrderRequests.length > 0){
				// console.log('allStores',allStores);
				res.end(JSON.stringify({
	                    response: 1,
	                    message: Messages['en'].SUCCESS_FETCH,
	                    result: salesOrderRequests
	                }));
			}else{
				res.end(JSON.stringify({
	                    response: 3,
	                    message: Messages['en'].EMPTY_DATA
	                }));
			}
		}, error => {
			console.log('get salesOrderRequests error',error);
			res.end(JSON.stringify({
                    response: 0,
                    message: Messages['en'].ERROR_FETCH
                }));
		})
	}else{
		res.end(JSON.stringify({
	            response: 2,
	            message: Messages['en'].WRONG_DATA
	        }));	
	}
}

exports.sales_request_change_status_supervisor = function(req, res){
	if(req.body.user_id != "" && req.body.user_id != null && req.body.supervisor_id != "" && req.body.supervisor_id != null && req.body.status != "" && req.body.status != null && req.body.request_id != "" && req.body.request_id != null){
		Models.SalesOrderRequest.findOne({
			where:{
				id:req.body.request_id,
				supervisor_id:req.body.supervisor_id,
				supervisor_status:'pending'
			}
		}).then(salesRequestChk => {
			if(salesRequestChk == null){
				res.end(JSON.stringify({
	                    response: 3,
	                    message: Messages['en'].EMPTY_DATA
	                }));
			}else{
				if(req.body.status == "accepted" || req.body.status == "rejected"){
					salesRequestChk.update({
						supervisor_status:req.body.status,
						supervisor_note:req.body.supervisor_note
					}).then(salesReqUpdateRes => {
						res.end(JSON.stringify({
							response:1,
							message: Messages['en'].SUCCESS_UPDATE
						}));
					}, err => {
						console.log('get salesReqUpdateRes error',err);
						res.end(JSON.stringify({
			                    response: 0,
			                    message: Messages['en'].ERROR_FETCH
			                }));			
					})
				}else{
					res.end(JSON.stringify({
	                    response: 4,
	                    message: Messages['en'].WRONG_STATUS
	                }));	
				}
			}
		}, error => {
			console.log('get salesReqUpdateRes error',error);
			res.end(JSON.stringify({
                    response: 0,
                    message: Messages['en'].ERROR_FETCH
                }));	
		})
	}else{
		res.end(JSON.stringify({
	            response: 2,
	            message: Messages['en'].WRONG_DATA
	        }));	
	}
}

exports.sales_request_change_status_salesmanager = function(req, res){
	if(req.body.user_id != "" && req.body.user_id != null && req.body.salesmanager_id != "" && req.body.salesmanager_id != null && req.body.status != "" && req.body.status != null && req.body.request_id != "" && req.body.request_id != null){
		Models.SalesOrderRequest.findOne({
			where:{
				id:req.body.request_id,
				salesmanager_id:req.body.salesmanager_id,
				salesmanager_status:'pending'
			}
		}).then(salesRequestChk => {
			if(salesRequestChk == null){
				res.end(JSON.stringify({
	                    response: 3,
	                    message: Messages['en'].EMPTY_DATA
	                }));
			}else{
				if(req.body.status == "accepted" || req.body.status == "rejected"){
					salesRequestChk.update({
						salesmanager_status:req.body.status,
						salesmanager_note:req.body.salesmanager_note
					}).then(salesReqUpdateRes => {
						res.end(JSON.stringify({
							response:1,
							message: Messages['en'].SUCCESS_UPDATE
						}));
					}, err => {
						console.log('get salesReqUpdateRes error',err);
						res.end(JSON.stringify({
			                    response: 0,
			                    message: Messages['en'].ERROR_FETCH
			                }));			
					})
				}else{
					res.end(JSON.stringify({
	                    response: 4,
	                    message: Messages['en'].WRONG_STATUS
	                }));	
				}
			}
		}, error => {
			console.log('get salesReqUpdateRes error',error);
			res.end(JSON.stringify({
                    response: 0,
                    message: Messages['en'].ERROR_FETCH
                }));	
		})
	}else{
		res.end(JSON.stringify({
	            response: 2,
	            message: Messages['en'].WRONG_DATA
	        }));	
	}
}

exports.load_request_change_status_salesmanager = function(req, res){
	if(req.body.user_id != "" && req.body.user_id != null && req.body.salesmanager_id != "" && req.body.salesmanager_id != null && req.body.status != "" && req.body.status != null && req.body.request_id != "" && req.body.request_id != null){
		Models.EmployeeLoadItemsRequests.findOne({
			where:{
				id:req.body.request_id,
				salesmanager_id:req.body.salesmanager_id,
				salesmanager_status:'pending'
			}
		}).then(loadRequestChk => {

			if(loadRequestChk == null){
				res.end(JSON.stringify({
	                    response: 3,
	                    message: Messages['en'].EMPTY_DATA
	                }));
			}else{
				if(req.body.status == "accepted" || req.body.status == "rejected"){
					loadRequestChk.update({
						salesmanager_status:req.body.status,
						salesmanager_note:req.body.salesmanager_note
					}).then(loadReqUpdateRes => {
						let gcm_obj = {};
						gcm_obj.req_type = 'salesmanager_load_action',gcm_obj.action = 'salesmanager';
						if(loadRequestChk.employee_id != null && loadRequestChk.employee_id != ""){
							console.log('supervisor_id',loadRequestChk.employee_id)
							Models.GcmDevices.findOne({
								where:{
									employee_id:loadRequestChk.employee_id
								}
							}).then(gcmDev => {
								console.log('supervisor_id sending notify')
								if(gcmDev != null && gcmDev.device_token != null){
									_sendPushNotificationAndroid(gcmDev.device_token, 'Load Request', 'Load request no. '+loadRequestChk.id+' has been '+req.body.status, gcm_obj);
								}else{
									console.log('data is null in gcmDev supervisor');
								}
							},error => {
								console.log('error in sending notification');
							})
						}

						if(loadRequestChk.supervisor_id != null && loadRequestChk.supervisor_id != ""){
							console.log('supervisor_id',loadRequestChk.supervisor_id)
							Models.GcmDevices.findOne({
								where:{
									employee_id:loadRequestChk.supervisor_id
								}
							}).then(gcmDev => {
								console.log('supervisor_id sending notify')
								if(gcmDev != null && gcmDev.device_token != null){
									_sendPushNotificationAndroid(gcmDev.device_token, 'Load Request', 'Load request no. '+loadRequestChk.id+' has been '+req.body.status, gcm_obj);
								}else{
									console.log('data is null in gcmDev supervisor');
								}
							},error => {
								console.log('error in sending notification');
							})
						}

						res.end(JSON.stringify({
							response:1,
							message: Messages['en'].SUCCESS_UPDATE
						}));
					}, err => {
						console.log('get loadRequestUpdateRes error',err);
						res.end(JSON.stringify({
			                    response: 0,
			                    message: Messages['en'].ERROR_FETCH
			                }));			
					})
				}else{
					res.end(JSON.stringify({
	                    response: 4,
	                    message: Messages['en'].WRONG_STATUS
	                }));	
				}
			}
		}, error => {
			console.log('get loadRequestChk error',error);
			res.end(JSON.stringify({
                    response: 0,
                    message: Messages['en'].ERROR_FETCH
                }));	
		})
	}else{
		res.end(JSON.stringify({
	            response: 2,
	            message: Messages['en'].WRONG_DATA
	        }));	
	}
}

exports.unload_request_change_status_salesmanager = function(req, res){
	if(req.body.user_id != "" && req.body.user_id != null && req.body.salesmanager_id != "" && req.body.salesmanager_id != null && req.body.status != "" && req.body.status != null && req.body.request_id != "" && req.body.request_id != null){
		Models.EmployeeUnloadItemsRequests.findOne({
			where:{
				id:req.body.request_id,
				salesmanager_id:req.body.salesmanager_id,
				salesmanager_status:'pending'
			}
		}).then(unloadRequestChk => {
			if(unloadRequestChk == null){
				res.end(JSON.stringify({
	                    response: 3,
	                    message: Messages['en'].EMPTY_DATA
	                }));
			}else{
				if(req.body.status == "accepted" || req.body.status == "rejected"){
					unloadRequestChk.update({
						salesmanager_status:req.body.status,
						salesmanager_note:req.body.salesmanager_note
					}).then(loadReqUpdateRes => {
						let gcm_obj = {};
						gcm_obj.req_type = 'salesmanager_load_action',gcm_obj.action = 'salesmanager';
						if(unloadRequestChk.employee_id != null && unloadRequestChk.employee_id != ""){
							console.log('supervisor_id',unloadRequestChk.employee_id)
							Models.GcmDevices.findOne({
								where:{
									employee_id:unloadRequestChk.employee_id
								}
							}).then(gcmDev => {
								console.log('supervisor_id sending notify')
								if(gcmDev != null && gcmDev.device_token != null){
									_sendPushNotificationAndroid(gcmDev.device_token, 'Unload Request', 'Unload request no. '+unloadRequestChk.id+' has been '+req.body.status, gcm_obj);
								}else{
									console.log('data is null in gcmDev supervisor');
								}
							},error => {
								console.log('error in sending notification');
							})
						}

						if(unloadRequestChk.supervisor_id != null && unloadRequestChk.supervisor_id != ""){
							console.log('supervisor_id',unloadRequestChk.supervisor_id)
							Models.GcmDevices.findOne({
								where:{
									employee_id:unloadRequestChk.supervisor_id
								}
							}).then(gcmDev => {
								console.log('supervisor_id sending notify')
								if(gcmDev != null && gcmDev.device_token != null){
									_sendPushNotificationAndroid(gcmDev.device_token, 'Unload Request', 'Unload request no. '+unloadRequestChk.id+' has been '+req.body.status, gcm_obj);
								}else{
									console.log('data is null in gcmDev supervisor');
								}
							},error => {
								console.log('error in sending notification');
							})
						}

						res.end(JSON.stringify({
							response:1,
							message: Messages['en'].SUCCESS_UPDATE
						}));
					}, err => {
						console.log('get loadRequestUpdateRes error',err);
						res.end(JSON.stringify({
			                    response: 0,
			                    message: Messages['en'].ERROR_FETCH
			                }));			
					})
				}else{
					res.end(JSON.stringify({
	                    response: 4,
	                    message: Messages['en'].WRONG_STATUS
	                }));	
				}
			}
		}, error => {
			console.log('get loadRequestChk error',error);
			res.end(JSON.stringify({
                    response: 0,
                    message: Messages['en'].ERROR_FETCH
                }));	
		})
	}else{
		res.end(JSON.stringify({
	            response: 2,
	            message: Messages['en'].WRONG_DATA
	        }));	
	}
}

exports.get_all_supervisors_under_salesmanager = function(req, res){
	if(req.body.user_id != null && req.body.user_id != "" && req.body.salesmanager_id != null && req.body.salesmanager_id != ""){
		Models.Employees.findAll({
			where:{
				user_id:req.body.user_id,
				salesmanager_id:req.body.salesmanager_id
			},
			attributes: { 
				include:['id','user_id','employee_name_en','employee_name_ar','phone_no','username']
			}
		}).then(supervisorList => {
			if(supervisorList.length > 0){
				res.end(JSON.stringify({
	                    response: 1,
	                    message: Messages['en'].SUCCESS_FETCH,
	                    result: supervisorList
	                }));
			}else{
				res.end(JSON.stringify({
	                    response: 3,
	                    message: Messages['en'].EMPTY_DATA
	                }));
			}
		},error => {
			console.log('get supervisors list error',error);
			res.end(JSON.stringify({
                    response: 0,
                    message: Messages['en'].ERROR_FETCH
                }));	
		})
	}else{
		res.end(JSON.stringify({
	            response: 2,
	            message: Messages['en'].WRONG_DATA
	        }));
	}
}

exports.get_sales_order_request_items_list = function(req, res){
	// req.body = {"user_id":"7","sales_order_request_id":"93"};
	if(req.body.user_id != null && req.body.user_id != "" && req.body.sales_order_request_id != null && req.body.sales_order_request_id != ""){
		Models.SalesOrderRequestDetail.findAll({
			where:{
				sales_order_request_id:req.body.sales_order_request_id,
				user_id:req.body.user_id
			},
			include:[{
						model:Models.Items,
						as:'item_detail_in_sales_request_detail'
					},{
						model:Models.MeasurementUnit,
						as:'measurement_unit_in_sales_request_detail'
					},{
						model: Models.SalesOrderRequestDetailPromotion,
						as: 'promotions_in_sales_order_request_details',
						include: [
							{
								model: Models.Promotions,
								as: 'sales_order_request_promotion_details',
								attributes: ['id','name','promotion_type','start_date_time','end_date_time','valid_for','status'],
							}
						]
					}]
		}).then(salesRequestItems => {
			if(salesRequestItems.length > 0){
				res.end(JSON.stringify({
	                    response: 1,
	                    message: Messages['en'].SUCCESS_FETCH,
	                    result: salesRequestItems
	                }));
			}else{
				res.end(JSON.stringify({
	                    response: 3,
	                    message: Messages['en'].EMPTY_DATA
	                }));
			}
		}, error => {
			console.log('!8!8!8!8 sales order request items desc error !8!8!8!8',error);
			res.end(JSON.stringify({
                    response: 0,
                    message: Messages['en'].ERROR_FETCH
                }));
		})
	}else{
		res.end(JSON.stringify({
	            response: 2,
	            message: Messages['en'].WRONG_DATA
	        }));
	}
}

exports.all_promotions_according_to_item = function(req, res){
	if(req.body.user_id != null && req.body.user_id != "" && req.body.item_id != null && req.body.item_id != "" && req.body.measurement_unit_id != null && req.body.measurement_unit_id != ""){
		let where_cond = {};
		where_cond.user_id = req.body.user_id;
		// console.log('this is all promtions ==================',req.body);
		Models.Promotions.findAll({
				where:where_cond,
				include:[{
							model:Models.PromotionsRangeGroupsItems,
							as: 'range_promotion_items_in_promotions',
							where:{
								main_item_id:req.body.item_id,
								main_item_unit_id:req.body.measurement_unit_id
							},
							required:false
						},{
							model:Models.PackagePromotionItems,
							as: 'package_promotion_items_in_promotions',
							where:{
								item_id:req.body.item_id,
								measurement_unit_id:req.body.measurement_unit_id
							},
							required:false
						},{
							model:Models.QuantityPromotionItems,
							as: 'quantity_promotion_items_in_promotions',
							where:{
								item_id:req.body.item_id,
								measurement_unit_id:req.body.measurement_unit_id
							},
							required:false
						}],
				order: [
	            	['priority', 'ASC']
	        	],				
			}).then(allPromotions => {
				// console.log('success ----------------------------------');
				if(allPromotions.length > 0){
					res.end(JSON.stringify({
		                    response: 1,
		                    message: Messages['en'].SUCCESS_FETCH,
		                    result: allPromotions
		                }));
				}else{
					res.end(JSON.stringify({
		                    response: 3,
		                    message: Messages['en'].EMPTY_DATA
		                }));
				}
			}, error => {
				console.log('!--------! promotions fetch error !--------!',error);
				res.end(JSON.stringify({
	                    response: 0,
	                    message: Messages['en'].ERROR_FETCH
	                }));
			})
	}else{
		res.end(JSON.stringify({
	            response: 2,
	            message: Messages['en'].WRONG_DATA
	        }));
	}
}


exports.items_according_to_range_promotion = function(req, res){
	if(req.body.range_group_id != '' && req.body.range_group_id != null && req.body.user_id != '' && req.body.user_id != null){
		let where_cond = {};
		if(req.body.range_group_id != '' && req.body.range_group_id != null){
			where_cond.range_group_id = {$in:Array.isArray(req.body.range_group_id) ? req.body.range_group_id : [req.body.range_group_id]}; 
		}
		where_cond.user_id=req.body.user_id

		if(req.body.range_item_id != '' && req.body.range_item_id != null){
			where_cond.id = {$in:Array.isArray(req.body.range_item_id) ? req.body.range_item_id : [req.body.range_item_id]};
		}

		Models.PromotionsRangeGroupsItems.findAll({
			where: where_cond,
			include:[
				{
					model: Models.Items,
					as: 'range_group_free_items'
				},
				{
					model: Models.MeasurementUnit,
					as: 'range_group_free_item_measurement_unit'
				}
			]
		}).then(items=>{
			if(items.length>0){
				res.json({
					response: 1,
						message: Messages['en'].SUCCESS_FETCH,
						result: items
					})
			}else{	
				res.end(JSON.stringify({
                    response: 3,
                    message: Messages['en'].EMPTY_DATA
                }));
			}
		},error => {
			console.log('!--------! items according to range promotion !--------!',error);
			res.end(JSON.stringify({
                    response: 0,
                    message: Messages['en'].ERROR_FETCH
                }));
		})
	}else{
		res.end(JSON.stringify({
	            response: 2,
	            message: Messages['en'].WRONG_DATA
	        }));
	}
}

exports.quantity_value_according_to_item = function(req, res){

	// req.body = {"item_ids":["1","4"]};
	console.log('item ids ====================',req.body);

	if (req.body.item_ids != '' && req.body.item_ids != null) {
		Models.Promotions.findAll({
			where:{
				promotion_type:'quantity'
			},
			include: [{
				model:Models.QuantityPromotionItems,
				as: 'quantity_promotion_items_in_promotions',
				where:{
					item_id:{$in:Array.isArray(req.body.item_ids) ? req.body.item_ids : [req.body.item_ids]}
				},
				required:true
			}]
		}).then(allPromotions => {
			console.log('all promotions data --------------------------- ',allPromotions);
			if (allPromotions.length>0) {
				res.end(JSON.stringify({
	                    response: 1,
	                    message: Messages['en'].SUCCESS_FETCH,
	                    result: allPromotions
	                }));
			}else{
				res.end(JSON.stringify({
	                    response: 3,
	                    message: Messages['en'].EMPTY_DATA
	                }));
			}
		},error =>{
			console.log('!--------! promotions fetch error !--------!',error);
			res.end(JSON.stringify({
                    response: 0,
                    message: Messages['en'].ERROR_FETCH
                }));
		})
	}else{
		res.end(JSON.stringify({
	            response: 2,
	            message: Messages['en'].WRONG_DATA
	        }));
	}
}

exports.get_single_promotion_item_detail = function(req, res){
	// req.body = {"promotion_item_id":"[58, 46]","promotion_type":"range"};
	console.log("req data >>>>>>>>>>>>>>>>>>>>>>>>"+req.body);
	if(req.body.promotion_item_id != '' && req.body.promotion_item_id != null && req.body.promotion_type != '' && req.body.promotion_type != null){
		let promotion_type = req.body.promotion_type,
			promotion_item_id = req.body.promotion_item_id;
			console.log("promotion item id >>>>>>>>>>>>>>>>>>>>>>>>  "+req.body.promotion_item_id);
			console.log("promotion item id check >>>>>>>>>>>>>>>>>>>>>>>>  "+Array.isArray(req.body.promotion_item_id));
			if(promotion_type == 'range'){
				Models.PromotionsRangeGroupsItems.findAll({
					where:{
						id:{
							$in:Array.isArray(promotion_item_id) ? promotion_item_id : [promotion_item_id]
							// [Op.in]:promotion_item_id
						}
					},
					include:[{
						model: Models.Items,
						as: 'range_group_free_items'
					},{
						model: Models.MeasurementUnit,
						as: 'range_group_free_item_measurement_unit'
					}]
				}).then(promotionItem => {
					console.log("all data >>>>>>>>>>>>>>>>"+promotionItem);
					if(promotionItem != null){
						
					console.log("if all data >>>>>>>>>>>>>>>>"+promotionItem);
						res.end(JSON.stringify({
		                    response: 1,
		                    message: Messages['en'].SUCCESS_FETCH,
		                    result: promotionItem
		                }));
					}else{
					console.log("else all data >>>>>>>>>>>>>>>>");
						res.end(JSON.stringify({
			                    response: 3,
			                    message: Messages['en'].EMPTY_DATA
			                }));
					}
				},error => {
					console.log('!--------! get single promotion item detail !--------!',error);
					res.end(JSON.stringify({
		                    response: 0,
		                    message: Messages['en'].ERROR_FETCH
		                }));
				})
			}else if(promotion_type == 'package'){
				Models.PackagePromotionItems.findOne({
					where:{
						id:promotion_item_id
					}
				}).then(promotionItem => {
					if(promotionItem != null){
						res.end(JSON.stringify({
		                    response: 1,
		                    message: Messages['en'].SUCCESS_FETCH,
		                    result: promotionItem
		                }));
					}else{
						res.end(JSON.stringify({
			                    response: 3,
			                    message: Messages['en'].EMPTY_DATA
			                }));
					}
				},error => {
					console.log('!--------! get single promotion item detail !--------!',error);
					res.end(JSON.stringify({
		                    response: 0,
		                    message: Messages['en'].ERROR_FETCH
		                }));
				})
			}else{
				res.end(JSON.stringify({
			            response: 2,
			            message: Messages['en'].WRONG_DATA
			        })); 	
			}
	}else{
		res.end(JSON.stringify({
	            response: 2,
	            message: Messages['en'].WRONG_DATA
	        }));	
	}
}

exports.promotion_output_items_details = function(req, res){
	if(req.body.promotion_id != null && req.body.promotion_id != ""){
		let where_cond = {};
		where_cond.qty_promotion_id = req.body.promotion_id;
		console.log("output item request =====================",req.body);
		Models.OutputQuantityPromotionItems.findAll({
				where:where_cond,
				include:[
							{
								model:Models.Items,
								as:'item_detail_in_output_quantity_promotion_items'
							},{
								model:Models.MeasurementUnit,
								as:'measurement_unit_in_output_quantity_promotion_items'
							},{
								model:Models.Promotions,
								as:'output_quantity_promotion_details'
							},
	        			],				
			}).then(allPromotionItems => {
				if(allPromotionItems.length > 0){
				console.log('success ----------------------------------',allPromotionItems);
					res.end(JSON.stringify({
		                    response: 1,
		                    message: Messages['en'].SUCCESS_FETCH,
		                    result: allPromotionItems
		                }));
				}else{
					res.end(JSON.stringify({
		                    response: 3,
		                    message: Messages['en'].EMPTY_DATA
		                }));
				}
			}, error => {
				console.log('!--------! promotions fetch error !--------!',error);
				res.end(JSON.stringify({
	                    response: 0,
	                    message: Messages['en'].ERROR_FETCH
	                }));
			})
	}else{
		res.end(JSON.stringify({
	            response: 2,
	            message: Messages['en'].WRONG_DATA
	        }));
	}
}

exports.get_store_stock_list = function(req, res) {
	if (req.body.user_id!=null && req.body.user_id!="" && req.body.store_id!=null && req.body.store_id!="") {
		console.log('req body ==============',req.body);
		Models.StockItems.findAll({
			where:{
				user_id:req.body.user_id,
				store_id:req.body.store_id
			},include:[{
				model:Models.Items,
				as:'item_detail_in_stock_items',
				include:[
					{
						model:Models.ItemCategories,
						as:'category_detail_in_items'
					},{
						model:Models.ItemSubCategories,
						as:'sub_category_detail_in_items'
					}]
			},{
				model:Models.MeasurementUnit,
				as:'measurement_unit_in_stock_items',
				// attributes: { 
				// 	include:['id','user_id','employee_name_en','employee_name_ar','phone_no','username','salesmanager_id']
				// }
			}]
		}).then(stockData => {
			console.log('success =================',stockData);
			res.end(JSON.stringify({
                    response: 1,
                    message: Messages['en'].SUCCESS_FETCH,
                    result: stockData
                }));
		},error => {
			console.log('error =================');
			res.end(JSON.stringify({
                    response: 0,
                    message: Messages['en'].ERROR_FETCH
                }));
		})
	}else{
		res.end(JSON.stringify({
	            response: 2,
	            message: Messages['en'].WRONG_DATA
	        }));
	}
}

exports.update_store_stock = function(req, res) {
	if (req.body.stock_item_id!=null && req.body.stock_item_id!="" && req.body.quantity!=null && req.body.quantity!="") {
		console.log('req body ==============',req.body);
		Models.StockItems.update({
			quantity:req.body.quantity
		},{
			where:{
				id:req.body.stock_item_id
			}
		}).then(updateStockItemQuantity => {
			Models.StockItems.findOne({
				where:{
					id:req.body.stock_item_id
				},include:[{
					model:Models.Items,
					as:'item_detail_in_stock_items',
				},{
					model:Models.MeasurementUnit,
					as:'measurement_unit_in_stock_items',
					// attributes: { 
					// 	include:['id','user_id','employee_name_en','employee_name_ar','phone_no','username','salesmanager_id']
					// }
				}]
			}).then(stockData => {
				console.log('success =================',stockData);
				res.end(JSON.stringify({
	                    response: 1,
	                    message: Messages['en'].SUCCESS_UPDATE,
	                    result: stockData
	                }));
			},error => {
				console.log('error =================');
				res.end(JSON.stringify({
	                    response: 0,
	                    message: Messages['en'].ERROR_FETCH
	                }));
			})
		},error => {
			res.end(JSON.stringify({
                    response: 0,
                    message: Messages['en'].ERROR_FETCH
                }));
		})
		
	}else{
		res.end(JSON.stringify({
	            response: 2,
	            message: Messages['en'].WRONG_DATA
	        }));
	}
}

// exports.stock_taking_requests = function(req, res) {
// 	console.log(' stock taking request req body ==============',req.body);
// 	if(req.body.user_id != "" && req.body.user_id != null && req.body.store_id != "" && req.body.store_id != null && req.body.item_id != "" && req.body.item_id != null && req.body.measurement_unit_id != "" && req.body.measurement_unit_id != null && req.body.actual_quantity != "" && req.body.actual_quantity != null && req.body.desired_quantity != "" && req.body.desired_quantity != null){
// 		Models.EmployeeStockTakingRequests.create({
// 			user_id:req.body.user_id,
// 			store_id:req.body.store_id,
// 			item_id:req.body.item_id,
// 			measurement_unit_id:req.body.measurement_unit_id,
// 			actual_quantity:req.body.actual_quantity,
// 			desired_quantity:req.body.desired_quantity,
// 		}).then(addedStockTakingRequest => {
// 			res.end(JSON.stringify({
//                         response: 1,
//                         message: Messages['en'].SUCCESS_INSERT,
//                         result: addedStockTakingRequest
//                     }));
// 		},error => {
// 			res.end(JSON.stringify({
//                         response: 2,
//                         message: Messages['en'].ERROR_CREATE
//                     }));
// 		})
// 	}else{
// 		res.end(JSON.stringify({
//                     response: 2,
//                     message: Messages['en'].WRONG_DATA
//                 }));
// 	}
// }

exports.stock_taking_requests = function(req, res) {
	// req.body = {
	// "employee_id": "13",
	// "user_id": "7",
	// "store_id": "30",
	// "total_diff_quantity": "3350",
	// "total_short_inc_value": "101309",
	// "request_item_arr": [{
	// "desired_quantity": "23",
	// "remaining_quantity": "99",
	// "sub_total": "4950",
	// "measurement_unit_id": "16",
	// "actual_quantity": "122",
	// "item_id": "1"
	// }, {
	// "desired_quantity": "21",
	// "remaining_quantity": "1224",
	// "sub_total": "36720",
	// "measurement_unit_id": "23",
	// "actual_quantity": "1245",
	// "item_id": "4"
	// }, {
	// "desired_quantity": "20",
	// "remaining_quantity": "5",
	// "sub_total": "250",
	// "measurement_unit_id": "23",
	// "actual_quantity": "25",
	// "item_id": "1"
	// }, {
	// "desired_quantity": "19",
	// "remaining_quantity": "99981",
	// "sub_total": "2999430",
	// "measurement_unit_id": "23",
	// "actual_quantity": "100000",
	// "item_id": "11"
	// }]
	// }
	console.log(' stock taking request req body ==============',req.body);
	if(req.body.employee_id != "" && req.body.employee_id != null && req.body.user_id != "" && req.body.user_id != null && req.body.store_id != "" && req.body.store_id != null && req.body.total_diff_quantity != "" && req.body.total_diff_quantity != null && req.body.total_short_inc_value != "" && req.body.total_short_inc_value != null){
		Models.EmployeeStockTakingRequests.create({
			employee_id:req.body.employee_id,
			user_id:req.body.user_id,
			store_id:req.body.store_id,
			total_diff_quantity:req.body.total_diff_quantity,
			total_short_inc_value:req.body.total_short_inc_value,
		}).then(async addedStockTakingRequest => {
			console.log('before for ==============',req.body.request_item_arr);
			for (var i = 0; i < req.body.request_item_arr.length; i++) {
				console.log('q step 2');
				if(req.body.request_item_arr[i].item_id && req.body.request_item_arr[i].measurement_unit_id && req.body.request_item_arr[i].actual_quantity && req.body.request_item_arr[i].desired_quantity && req.body.request_item_arr[i].remaining_quantity && req.body.request_item_arr[i].sub_total){
						await Models.EmployeeStockTakingRequestItems.create({
							stock_taking_request_id:addedStockTakingRequest.id,
							employee_id:req.body.employee_id,
							user_id:req.body.user_id,
							store_id:req.body.store_id,
							item_id:req.body.request_item_arr[i].item_id,
							measurement_unit_id:req.body.request_item_arr[i].measurement_unit_id,
							actual_quantity:req.body.request_item_arr[i].actual_quantity,
							desired_quantity:req.body.request_item_arr[i].desired_quantity,
							remaining_quantity:req.body.request_item_arr[i].remaining_quantity,
							sub_total:req.body.request_item_arr[i].sub_total,
						}).then(addedStockTakingRequestItem => {
							console.log('stock taking request item added ================',addedStockTakingRequestItem);

						},error => {
							res.end(JSON.stringify({
		                        response: 2,
		                        message: Messages['en'].ERROR_CREATE
		                    }));
						})
				}
				if(req.body.request_item_arr.length - 1 == i ){	
					console.log('stock taking request items added complete =============',addedStockTakingRequest.id);					
					Models.EmployeeStockTakingRequests.findOne({
						where:{
							id:addedStockTakingRequest.id,
						},include:[{
							model:Models.EmployeeStockTakingRequestItems,
							as:'stock_taking_request_items'
						}]
					}).then(stockTakingRequestData =>{
						res.end(JSON.stringify({
	                            response: 1,
	                            message: Messages['en'].SUCCESS_INSERT,
	                            result:stockTakingRequestData
	                        }));
					},error => {
						res.end(JSON.stringify({
		                    response: 0,
		                    message: Messages['en'].ERROR_FETCH
		                }));
					})					
				}
			}
		},error => {
			res.end(JSON.stringify({
                        response: 2,
                        message: Messages['en'].ERROR_CREATE
                    }));
		})
	}else{
		res.end(JSON.stringify({
                    response: 2,
                    message: Messages['en'].WRONG_DATA
                }));
	}
}

exports.check_stock_item_quantity = function(req, res){
	if (req.body.user_id!=null && req.body.user_id!="" && req.body.store_id!=null && req.body.store_id!="" && req.body.item_id!=null && req.body.item_id!="" && req.body.measurement_unit_id!=null && req.body.measurement_unit_id!="") {
		console.log("stock item quantity ==================", req.body);

		Models.StockItems.findOne({
			where:{
				user_id:req.body.user_id,
				store_id:req.body.store_id,
				item_id:req.body.item_id,
				measurement_unit_id:req.body.measurement_unit_id
			}
		}).then(stockItemData =>{			
			if(stockItemData!=null){
				console.log('stock item data =================',stockItemData);
				res.end(JSON.stringify({
                    response: 1,
                    message: Messages['en'].SUCCESS_FETCH,
                    result: stockItemData
                }));
			}else{
				console.log('empty data ================');
				res.end(JSON.stringify({
                    response: 3,
                    message: Messages['en'].EMPTY_DATA
                }));
			}
		},error => {
			res.end(JSON.stringify({
		                    response: 0,
		                    message: Messages['en'].ERROR_FETCH
		                }));
		})
	}else{
		res.end(JSON.stringify({
                    response: 2,
                    message: Messages['en'].WRONG_DATA
                }));
	}
}

exports.get_user_banks = function(req, res){
	if (req.body.user_id!=null && req.body.user_id!="") {
		Models.Banks.findAll({
			where:{
				user_id:req.body.user_id
			}
		}).then(userBanksData => {
			res.end(JSON.stringify({
                response: 1,
                message: Messages['en'].SUCCESS_FETCH,
                result: userBanksData
            }));
		},error => {
			res.end(JSON.stringify({
                response: 0,
                message: Messages['en'].ERROR_FETCH
            }));
		})
	}else{
		res.end(JSON.stringify({
            response: 2,
            message: Messages['en'].WRONG_DATA
        }));
	}
}

exports.get_user_bank_branches = function(req, res){
	if (req.body.user_id!=null && req.body.user_id!="" && req.body.bank_id!=null && req.body.bank_id!="") {
		Models.BankBranches.findAll({
			where:{
				user_id:req.body.user_id,
				bank_id:req.body.bank_id
			}
		}).then(userBankBranchesData => {
			res.end(JSON.stringify({
                response: 1,
                message: Messages['en'].SUCCESS_FETCH,
                result: userBankBranchesData
            }));
		},error => {
			res.end(JSON.stringify({
                response: 0,
                message: Messages['en'].ERROR_FETCH
            }));
		})
	}else{
		res.end(JSON.stringify({
            response: 2,
            message: Messages['en'].WRONG_DATA
        }));
	}
}

exports.get_customer_bank_branch_drawers = function(req, res){
	if (req.body.customer_id!=null && req.body.customer_id!="" && req.body.bank_id!=null && req.body.bank_id!="" && req.body.branch_id!=null && req.body.branch_id!="") {
		Models.CustomerDrawers.findAll({
			where:{
				customer_id:req.body.customer_id,
				bank_id:req.body.bank_id,
				branch_id:req.body.branch_id
			},
			include:[{
						model:Models.Customers,
						as:'customer_detail_in_customer_drawers'
					}]
		}).then(drawerData => {
			res.end(JSON.stringify({
                response: 1,
                message: Messages['en'].SUCCESS_FETCH,
                result: drawerData
            }));
		},error => {
			res.end(JSON.stringify({
                response: 0,
                message: Messages['en'].ERROR_FETCH
            }));
		})
	}else{
		res.end(JSON.stringify({
            response: 2,
            message: Messages['en'].WRONG_DATA
        }));
	}
}

exports.submit_payment = function(req, res){
	if (req.body.user_id!=null && req.body.user_id!="" && req.body.employee_id!=null && req.body.employee_id!="" && req.body.customer_id!=null && req.body.customer_id!="" && req.body.payment_type!=null && req.body.payment_type!="" && req.body.amount!=null && req.body.amount!="" && req.body.bank_id!=null && req.body.bank_id!="" && req.body.branch_id!=null && req.body.branch_id!="" && req.body.drawer_name!=null && req.body.drawer_name!="") {

		// if (req.body.payment_type=="cash") {
		// 	req.body.cheque_no=null;
		// 	req.body.due_date=null;
		// 	req.body.note=null;
		// 	req.body.image=null;
		// }

		if (req.body.payment_type=="cheque" && req.body.cheque_no==null && req.body.cheque_no==null && req.body.due_date==null && req.body.due_date==null) {
			res.end(JSON.stringify({
	            response: 2,
	            message: Messages['en'].WRONG_DATA
	        }));
		}

		if(req.files && req.files.image != "" && req.files.image != null){
			let image = req.files.image;
			image_name = Date.now() + '_' + Math.floor(10000 + Math.random() * 90000)+"."+file_type_regex.exec(image.name)[1] ;
	        
	        req.body.image = image_name;

	        _uploadImage(image, LOCAL_IMAGES_URL+'customer_payment_imgs/' + image_name, image_name, function(resp_type, response, extra){
	            if(resp_type == "success"){
	                // console.log(extra)
	            }

	            if(resp_type == "error"){
	                res.end(JSON.stringify({
	                    response: 0,
	                    message: messages.ERROR_FETCH
	                }))
	            }
	        })
		}
		// console.log("req body =================",req.body);
		Models.CustomerPayments.create({
			user_id:req.body.user_id,
			employee_id:req.body.employee_id,
			customer_id:req.body.customer_id,
			payment_type:req.body.payment_type,
			amount:req.body.amount,
			bank_id:req.body.bank_id,
			branch_id:req.body.branch_id,
			drawer_name:req.body.drawer_name,
			cheque_no:req.body.cheque_no ? req.body.cheque_no : "",
			due_date:req.body.due_date ? req.body.due_date : "",
			note:req.body.note ? req.body.note : "",
			image:req.body.image ? req.body.image : "" 
		}).then(submitPaymentData => {
			// console.log("success ===================");
			res.end(JSON.stringify({
                response: 1,
                message: Messages['en'].SUCCESS_INSERT,
                result: submitPaymentData
            }));
		},error => {
			// console.log("error ===================");
			res.end(JSON.stringify({
                response: 0,
                message: Messages['en'].ERROR_CREATE
            }));
		})
	}else{
		res.end(JSON.stringify({
            response: 2,
            message: Messages['en'].WRONG_DATA
        }));
	}
}

exports.get_customer_payment_list = function(req, res){
	if (req.body.customer_id!=null && req.body.customer_id!="" && req.body.user_id!=null && req.body.user_id!="") {
		Models.CustomerPayments.findAll({
			where:{
				customer_id:req.body.customer_id,
				user_id:req.body.user_id
			}
		}).then(paymentListData => {
			res.end(JSON.stringify({
                response: 1,
                message: Messages['en'].SUCCESS_FETCH,
                result: paymentListData
            }));
		},error => {
			res.end(JSON.stringify({
                response: 0,
                message: Messages['en'].ERROR_FETCH
            }));
		})
	}else{
		res.end(JSON.stringify({
            response: 2,
            message: Messages['en'].WRONG_DATA
        }));
	}
}

exports.save_fcm_token=function(req, res){
	if(req.body.user_id != null && req.body.user_id != "" && req.body.employee_id != null && req.body.employee_id != "" && req.body.device_id != null && req.body.device_id != "" && req.body.device_token != null && req.body.device_token != ""){
		
		Models.GcmDevices.findOne({
			where:{
				user_id:req.body.user_id,
				employee_id:req.body.employee_id,
				// device_id:req.body.device_id,	
			}
		}).then(chkDevice => {
			if(chkDevice == null){
				Models.GcmDevices.create({
					user_id:req.body.user_id,
					employee_id:req.body.employee_id,
					device_id:req.body.device_id,
					device_token:req.body.device_token
				}).then(createDevice => {
					res.end(JSON.stringify({
		                    response: 1,
		                    message: Messages['en'].SUCCESS_INSERT,
		                    result: createDevice
		                }));
				}, err => {
					console.log('error add device', err)
					res.end(JSON.stringify({
		                    response: 0,
		                    message: Messages['en'].ERROR_CREATE
		                }));
				})
			}else{
				Models.GcmDevices.update({
					device_token:req.body.device_token
				}, {
					where:{
						user_id:req.body.user_id,
						employee_id:req.body.employee_id,
						// device_id:req.body.device_id
					}
				}).then(updateDevice => {
					res.end(JSON.stringify({
		                    response: 1,
		                    message: Messages['en'].SUCCESS_UPDATE,
		                    result: updateDevice
		                }));
				}, err => {
					res.end(JSON.stringify({
		                    response: 0,
		                    message: Messages['en'].ERROR_CREATE
		                }));
				})
			}
		}, error => {
			res.end(JSON.stringify({
		                    response: 0,
		                    message: Messages['en'].ERROR_FETCH
		                }));
		})
	}else{
		res.end(JSON.stringify({
	            response: 2,
	            message: Messages['en'].WRONG_DATA
	        }));
	}
}

exports.remove_fcm_token = function(req, res){
	if(req.body.user_id != null && req.body.user_id != "" && req.body.employee_id != null && req.body.employee_id != "" && req.body.device_id != null && req.body.device_id != ""){
		Models.GcmDevices.destroy({
				where:{
					user_id:req.body.user_id,
					employee_id:req.body.employee_id,
					device_id:req.body.device_id
				}
			}).then(removed => {
				res.end(JSON.stringify({
		                            response: 1,
		                            message: Messages['en'].SUCCESS_DELETE
		                        }));
			}, error => {
				console.log(error);
				res.end(JSON.stringify({
			                            response: 0,
			                            message: Messages['en'].ERROR_FETCH
			                        }));
			})
	}else{
		res.end(JSON.stringify({
	                            response: 2,
	                            message: Messages['en'].WRONG_DATA
	                        }));	
	}
}
/*Common functions*/
/*--------PUSH NOTIFICATION STARTS---------*/
function _sendPushNotificationAndroid(token, title, description, obj){
	if(token != "" || token != null){
		console.log(token, title, description, obj)
		var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
	        to: token, 
	        // collapse_key: 'your_collapse_key',
	        
	        // notification: {
	        //     title: 'Title of your push notification', 
	        //     body: 'Body of your push notification' 
	        // },
	        
	        data: {  //you can send only notification or only data(or include both)
	            title: title,
	            description: description,
	            obj:obj
	        }
	    }
	    
	    fcm.send(message, function(err, response){
	        if (err) {
	            console.log("Something has gone wrong!")
	        } else {
	            console.log("Successfully sent with response: ", response)
	        }
	    })
	}
}
/*--------PUSH NOTIFICATION ENDS---------*/

function _uploadImage(obj, image_name, extra, callback){
    obj.mv(image_name, function(cert_err) {
        console.log('result',cert_err);
        if (cert_err) {
            callback('error',err,"");
        }else{
            callback('success',"",extra);
        }
    });
}

function send_email(template, mailOptions, callback) {
    // Send email.
    app.mailer.send(template, mailOptions, function(err, message) {
        if (err) {
            console.log(err);
            callback('err', err);
            //res.send('There was an error sending the email');
            return;
        }else{
        	callback('success', message);
        }
        //return res.send('Email has been sent!');
    });
}
/*Common functions end*/