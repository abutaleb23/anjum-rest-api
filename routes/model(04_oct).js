var Sequelize = require('sequelize');
var env = "dev";
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

exports.Employees = sequelize.define('employees',{
                            user_id:{type:Sequelize.INTEGER},
                            ref_id:{type:Sequelize.STRING},
                            employee_name_en:{type:Sequelize.STRING},
                            employee_name_ar:{type:Sequelize.STRING},
                            phone_no:{type:Sequelize.STRING},
                            username:{type:Sequelize.STRING},
                            password:{type:Sequelize.STRING},
                            email:{type:Sequelize.STRING},
                            type:{type:Sequelize.INTEGER},
                            customer_id:{type:Sequelize.INTEGER},
                            business_unit_id:{type:Sequelize.INTEGER},
                            app_device_id:{type:Sequelize.STRING},
                            group_type:{type:Sequelize.ENUM('cashvan', 'credit')},
                            reference:{type:Sequelize.STRING},
                            vehicle:{type:Sequelize.STRING},
                            collect_percent:{type:Sequelize.STRING},
                            sales_commission:{type:Sequelize.STRING},
                            salary:{type:Sequelize.STRING},
                            insurance:{type:Sequelize.STRING},
                            social_security:{type:Sequelize.STRING},
                            cash_box_account:{type:Sequelize.STRING},
                            debit_amount:{type:Sequelize.STRING},
                            store_id:{type:Sequelize.STRING},
                            supervisor_id:{type:Sequelize.INTEGER},
                            salesmanager_id:{type:Sequelize.INTEGER},
                            address:{type:Sequelize.STRING},
                            image:{type:Sequelize.STRING},
                            status:{type:Sequelize.ENUM('active', 'inactive')},
                            created_at:{type:Sequelize.DATE},
                            updated_at:{type:Sequelize.DATE}
                        });

exports.ItemCategories = sequelize.define('categories',{
                            user_id:{type:Sequelize.INTEGER},
                            category_name_en:{type:Sequelize.STRING},
                            category_name_ar:{type:Sequelize.STRING},
                            brand_manager:{type:Sequelize.STRING},
                            status:{type:Sequelize.ENUM('active', 'inactive')},
                            created_at:{type:Sequelize.DATE},
                            updated_at:{type:Sequelize.DATE},
                        });

exports.EmployeeAssignCustomers = sequelize.define('employee_assign_customers',{
                                    employee_id:{type:Sequelize.INTEGER},
                                    customer_id:{type:Sequelize.INTEGER},
                                    user_type:{type:Sequelize.INTEGER},
                                    created_at:{type:Sequelize.DATE},
                                    updated_at:{type:Sequelize.DATE}
                                });

exports.Customers = sequelize.define('customers',{
                        user_id:{type:Sequelize.INTEGER},
                        app_employee_id:{type:Sequelize.INTEGER},
                        ref_id:{type:Sequelize.STRING},
                        customer_id:{type:Sequelize.STRING},
                        customer_name_en:{type:Sequelize.STRING},
                        customer_name_ar:{type:Sequelize.STRING},
                        customer_type_id:{type:Sequelize.STRING},
                        email:{type:Sequelize.STRING},
                        phone_no:{type:Sequelize.STRING},
                        fax:{type:Sequelize.STRING},
                        tax_status:{type:Sequelize.ENUM('yes', 'no')},
                        image:{type:Sequelize.STRING},
                        credit_limit:{type:Sequelize.STRING},
                        cheque_due_date:{type:Sequelize.STRING},
                        discount:{type:Sequelize.FLOAT},
                        balance:{type:Sequelize.STRING},
                        payment_type:{type:Sequelize.ENUM('cheque', 'cash', 'online_gateway')},
                        price_list_id:{type:Sequelize.STRING},
                        state_id:{type:Sequelize.STRING},
                        city_id:{type:Sequelize.STRING},
                        area1:{type:Sequelize.STRING},
                        area2:{type:Sequelize.STRING},
                        location:{type:Sequelize.STRING},
                        latitude:{type:Sequelize.STRING},
                        longitude:{type:Sequelize.STRING},
                        status:{type:Sequelize.ENUM('active', 'inactive')},
                        created_at:{type:Sequelize.DATE},
                        updated_at:{type:Sequelize.DATE}
                    });

exports.ItemSubCategories = sequelize.define('sub_categories',{
                                user_id:{type:Sequelize.INTEGER},
                                category_id:{type:Sequelize.STRING},
                                sub_category_name_en:{type:Sequelize.STRING},
                                sub_category_name_ar:{type:Sequelize.INTEGER},
                                status:{type:Sequelize.ENUM('active', 'inactive')},
                                created_at:{type:Sequelize.DATE},
                                updated_at:{type:Sequelize.DATE}
                            });

exports.EmployeeVisits = sequelize.define('employee_visits',{
                            user_id:{type:Sequelize.INTEGER},
                            employee_id:{type:Sequelize.INTEGER},
                            customer_id:{type:Sequelize.INTEGER},
                            start_date_time:{type:Sequelize.DATE},
                            end_date_time:{type:Sequelize.DATE},
                            battery_life:{type:Sequelize.INTEGER},
                            android_version:{type:Sequelize.STRING},
                            latitude:{type:Sequelize.STRING},
                            longitude:{type:Sequelize.STRING},
                            current_visit_status:{type:Sequelize.ENUM('started', 'ended')},
                            created_at:{type:Sequelize.DATE},
                            updated_at:{type:Sequelize.DATE}
                        });

exports.EmployeeVisitPhotos = sequelize.define('employee_visit_photos',{
                                user_id:{type:Sequelize.INTEGER},
                                visit_id:{type:Sequelize.INTEGER},
                                employee_id:{type:Sequelize.INTEGER},
                                customer_id:{type:Sequelize.INTEGER},
                                image_name:{type:Sequelize.STRING},
                                created_at:{type:Sequelize.DATE},
                                updated_at:{type:Sequelize.DATE}
                            });

exports.EmployeeVisitNotes = sequelize.define('employee_visit_notes',{
                                user_id:{type:Sequelize.INTEGER},
                                visit_id:{type:Sequelize.INTEGER},
                                employee_id:{type:Sequelize.INTEGER},
                                customer_id:{type:Sequelize.INTEGER},
                                note:{type:Sequelize.STRING},
                                created_at:{type:Sequelize.DATE},
                                updated_at:{type:Sequelize.DATE}
                            });

exports.Items = sequelize.define('items',{
					user_id:{type:Sequelize.INTEGER},
					item_name_en:{type:Sequelize.STRING},
					item_name_ar:{type:Sequelize.STRING},
					item_number:{type:Sequelize.STRING},
					category_id:{type:Sequelize.INTEGER},
					sub_category_id:{type:Sequelize.INTEGER},
					sub_category_2_id:{type:Sequelize.INTEGER},
					inventory_id:{type:Sequelize.INTEGER},
					selling_price:{type:Sequelize.STRING},
					minimum_quantity:{type:Sequelize.STRING},
					reference:{type:Sequelize.STRING},
					image:{type:Sequelize.STRING},
					item_cost:{type:Sequelize.STRING},
					tax:{type:Sequelize.STRING},
					status:{type:Sequelize.ENUM('active', 'inactive')},
					stock_status:{type:Sequelize.ENUM('active', 'inactive')},
					tax_status:{type:Sequelize.ENUM('yes', 'no')},
					tax_type:{type:Sequelize.ENUM('value', 'percentage')},
					created_at:{type:Sequelize.DATE},
					updated_at:{type:Sequelize.DATE}
				});

exports.EmployeeVisitBeforeAfterPhotos = sequelize.define('employee_visit_before_after_photos',{
                                            user_id:{type:Sequelize.INTEGER},
                                            visit_id:{type:Sequelize.INTEGER},
                                            employee_id:{type:Sequelize.INTEGER},
                                            customer_id:{type:Sequelize.INTEGER},
                                            before_image_name:{type:Sequelize.STRING},
                                            after_image_name:{type:Sequelize.STRING},
                                            created_at:{type:Sequelize.DATE},
                                            updated_at:{type:Sequelize.DATE}
                                        });

exports.EmployeePermissions = sequelize.define('employee_permissions',{
                                user_id:{type:Sequelize.INTEGER},
                                employee_id:{type:Sequelize.INTEGER},
                                invoice:{type:Sequelize.ENUM('yes', 'no')},
                                return_invoice:{type:Sequelize.ENUM('yes', 'no')},
                                order:{type:Sequelize.ENUM('yes', 'no')},
                                payment:{type:Sequelize.ENUM('yes', 'no')},
                                stock_taking:{type:Sequelize.ENUM('yes', 'no')},
                                load_items:{type:Sequelize.ENUM('yes', 'no')},
                                unload_items:{type:Sequelize.ENUM('yes', 'no')},
                                take_photo:{type:Sequelize.ENUM('yes', 'no')},
                                before_after_photo:{type:Sequelize.ENUM('yes', 'no')},
                                note:{type:Sequelize.ENUM('yes', 'no')},
                                survey:{type:Sequelize.ENUM('yes', 'no')},
                                load_request_accept_reject:{type:Sequelize.ENUM('yes', 'no')},
                                unload_request_accept_reject:{type:Sequelize.ENUM('yes', 'no')},
                                sales_order_request_accept_reject:{type:Sequelize.ENUM('yes', 'no')},
                                sales_order_to_price:{type:Sequelize.ENUM('yes', 'no')},
                                request_to_exceed_customer_credit_limit:{type:Sequelize.ENUM('yes', 'no')},
                                request_to_exceed_cheque_due_date_limit:{type:Sequelize.ENUM('yes', 'no')},
                                request_to_return_invoice:{type:Sequelize.ENUM('yes', 'no')},
                                request_to_orders_approval:{type:Sequelize.ENUM('yes', 'no')},
                                request_to_change_invoice_payment_type:{type:Sequelize.ENUM('yes', 'no')},
                                request_to_exceed_customer_invoice_number:{type:Sequelize.ENUM('yes', 'no')},
                                request_to_visit_customer_not_in_route:{type:Sequelize.ENUM('yes', 'no')},
                                request_for_customer_login_without_verification:{type:Sequelize.ENUM('yes', 'no')},
                                employee_add_drawers_from_app:{type:Sequelize.ENUM('yes', 'no')},
                                created_at:{type:Sequelize.DATE},
                                updated_at:{type:Sequelize.DATE}
                            });

exports.EmployeeVisitPhotoComments = sequelize.define('employee_visit_photo_comments',{
                                user_id:{type:Sequelize.INTEGER},
                                photo_id:{type:Sequelize.INTEGER},
                                visit_id:{type:Sequelize.INTEGER},
                                employee_id:{type:Sequelize.INTEGER},
                                customer_id:{type:Sequelize.INTEGER},
                                comment:{type:Sequelize.STRING},
                                commented_by:{type:Sequelize.ENUM('emp', 'branch')},
                                created_at:{type:Sequelize.DATE},
                                updated_at:{type:Sequelize.DATE}
                            });;

exports.EmployeeVisitBeforeAfterPhotoComments = sequelize.define('employee_visit_before_after_photo_comments',{
                                user_id:{type:Sequelize.INTEGER},
                                photo_id:{type:Sequelize.INTEGER},
                                visit_id:{type:Sequelize.INTEGER},
                                employee_id:{type:Sequelize.INTEGER},
                                customer_id:{type:Sequelize.INTEGER},
                                comment:{type:Sequelize.STRING},
                                commented_by:{type:Sequelize.ENUM('emp', 'branch')},
                                created_at:{type:Sequelize.DATE},
                                updated_at:{type:Sequelize.DATE}
                            });;

exports.CustomerDrawers = sequelize.define('customer_drawers',{
                            customer_id:{type:Sequelize.INTEGER},
                            drawer_name:{type:Sequelize.STRING},
                            bank_id:{type:Sequelize.INTEGER},
                            branch_id:{type:Sequelize.INTEGER},
                            created_at:{type:Sequelize.DATE},
                            updated_at:{type:Sequelize.DATE}
                        });

exports.Countries = sequelize.define('countries',{
                        sortname:{type:Sequelize.STRING},
                        name:{type:Sequelize.STRING},
                        phonecode:{type:Sequelize.INTEGER},
                        currency:{type:Sequelize.STRING},
                        currency_short:{type:Sequelize.STRING},
                        status:{type:Sequelize.ENUM('active', 'inactive')}
                    });

exports.States = sequelize.define('states',{
                    name:{type:Sequelize.STRING},
                    country_id:{type:Sequelize.INTEGER},
                    status:{type:Sequelize.ENUM('active', 'inactive')}
                });

exports.Users = sequelize.define('users',{
                    branch_name_en:{type:Sequelize.STRING},
                    branch_name_ar:{type:Sequelize.STRING},
                    branch_location:{type:Sequelize.STRING},
                    company_id:{type:Sequelize.INTEGER},
                    location_lat:{type:Sequelize.STRING},
                    location_lng:{type:Sequelize.STRING},
                    email:{type:Sequelize.STRING},
                    password:{type:Sequelize.STRING},
                    area_1:{type:Sequelize.STRING},
                    area_2:{type:Sequelize.STRING},
                    city_id:{type:Sequelize.INTEGER},
                    state_id:{type:Sequelize.INTEGER},
                    country_id:{type:Sequelize.INTEGER},
                    currency:{type:Sequelize.STRING},
                    currency_short:{type:Sequelize.STRING},
                    phone_no:{type:Sequelize.STRING},
                    fax_no:{type:Sequelize.STRING},
                    vat_no:{type:Sequelize.STRING},
                    taxable_status:{type:Sequelize.ENUM('yes', 'no')},
                    status:{type:Sequelize.ENUM('active', 'inactive')},
                    created_at:{type:Sequelize.DATE},
                    updated_at:{type:Sequelize.DATE}
                });

exports.Cities = sequelize.define('cities',{
                    name:{type:Sequelize.STRING},
                    state_id:{type:Sequelize.INTEGER},
                    status:{type:Sequelize.ENUM('active', 'inactive')}
                });

exports.CustomerTypes = sequelize.define('customer_types',{
                            user_id:{type:Sequelize.INTEGER},
                            customer_type_en:{type:Sequelize.STRING},
                            customer_type_ar:{type:Sequelize.STRING},
                            status:{type:Sequelize.ENUM('active', 'inactive')},
                            created_at:{type:Sequelize.DATE},
                            updated_at:{type:Sequelize.DATE}
                        });

exports.Banks = sequelize.define('banks',{
                    bank_name_en:{type:Sequelize.STRING},
					bank_name_ar:{type:Sequelize.STRING},
					user_id:{type:Sequelize.INTEGER},
					note:{type:Sequelize.STRING},
					status:{type:Sequelize.ENUM('active', 'inactive')},
					created_at:{type:Sequelize.DATE},
					updated_at:{type:Sequelize.DATE}
                });

exports.BankBranches = sequelize.define('bank_branches',{
                    bank_id:{type:Sequelize.INTEGER},
                    user_id:{type:Sequelize.INTEGER},
                    branch_name_en:{type:Sequelize.STRING},
                    branch_name_ar:{type:Sequelize.STRING},
                    phone_no:{type:Sequelize.STRING},
                    fax_no:{type:Sequelize.STRING},
                    email:{type:Sequelize.STRING},
                    area_1:{type:Sequelize.STRING},
                    area_2:{type:Sequelize.STRING},
                    state_id:{type:Sequelize.INTEGER},
                    city_id:{type:Sequelize.INTEGER},
                    contact_person:{type:Sequelize.STRING},
                    note:{type:Sequelize.STRING},
                    status:{type:Sequelize.ENUM('active', 'inactive')},
                    created_at:{type:Sequelize.DATE},
                    updated_at:{type:Sequelize.DATE}
                });

exports.ItemUnitConversion = sequelize.define('item_unit_conversions',{
                                user_id:{type:Sequelize.INTEGER},
                                item_id:{type:Sequelize.INTEGER},
                                unit_type_id:{type:Sequelize.INTEGER},
                                no_of_piece:{type:Sequelize.STRING},
                                default_value:{type:Sequelize.ENUM('yes', 'no')},
                                created_at:{type:Sequelize.DATE},
                                updated_at:{type:Sequelize.DATE}
                            })

exports.MeasurementUnit = sequelize.define('measurement_units',{
                                user_id:{type:Sequelize.INTEGER},
                                unit_name_en:{type:Sequelize.STRING},
                                status:{type:Sequelize.ENUM('active', 'inactive')},
                                created_at:{type:Sequelize.DATE},
                                updated_at:{type:Sequelize.DATE}
                            })

exports.EmployeeLoadItemsRequests = sequelize.define('employee_load_items_requests',{
                                user_id:{type:Sequelize.INTEGER},
								request_level:{type:Sequelize.INTEGER},
                                employee_id:{type:Sequelize.INTEGER},
                                supervisor_id:{type:Sequelize.INTEGER},
                                salesmanager_id:{type:Sequelize.INTEGER},
                                store_id:{type:Sequelize.INTEGER},
                                salesman_store_id:{type:Sequelize.INTEGER},
                                no_of_items:{type:Sequelize.INTEGER},
                                supervisor_note:{type:Sequelize.STRING},
                                salesmanager_note:{type:Sequelize.STRING},
                                supervisor_status:{type:Sequelize.ENUM('pending', 'accepted','rejected')},
                                salesmanager_status:{type:Sequelize.ENUM('NA','pending', 'accepted','rejected')},
                                request_status:{type:Sequelize.ENUM('pending', 'accepted','rejected')},
                                created_at:{type:Sequelize.DATE}
                            })

exports.EmployeeUnloadItemsRequests = sequelize.define('employee_unload_items_requests',{
                                user_id:{type:Sequelize.INTEGER},
                                request_level:{type:Sequelize.INTEGER},
                                employee_id:{type:Sequelize.INTEGER},
                                supervisor_id:{type:Sequelize.INTEGER},
                                salesmanager_id:{type:Sequelize.INTEGER},
                                store_id:{type:Sequelize.INTEGER},
                                salesman_store_id:{type:Sequelize.INTEGER},
                                no_of_items:{type:Sequelize.INTEGER},
                                supervisor_note:{type:Sequelize.STRING},
                                salesmanager_note:{type:Sequelize.STRING},
                                request_status:{type:Sequelize.ENUM('pending', 'accepted')},
                                salesmanager_status:{type:Sequelize.ENUM('NA','pending', 'accepted','rejected')},
                                supervisor_status:{type:Sequelize.ENUM('pending', 'accepted')},
                                created_at:{type:Sequelize.DATE}
                            })

exports.EmployeeCartLoadItems = sequelize.define('employee_cart_load_items',{
                                user_id:{type:Sequelize.INTEGER},
                                employee_id:{type:Sequelize.INTEGER},
                                store_id:{type:Sequelize.INTEGER},
                                item_id:{type:Sequelize.INTEGER},
                                measurement_unit_id:{type:Sequelize.INTEGER},
                                quantity:{type:Sequelize.INTEGER},
                                created_at:{type:Sequelize.DATE}
                            })

exports.EmployeeCartUnloadItems = sequelize.define('employee_cart_unload_items',{
                                user_id:{type:Sequelize.INTEGER},
                                employee_id:{type:Sequelize.INTEGER},
                                store_id:{type:Sequelize.INTEGER},
                                item_id:{type:Sequelize.INTEGER},
                                measurement_unit_id:{type:Sequelize.INTEGER},
                                quantity:{type:Sequelize.INTEGER},
                                created_at:{type:Sequelize.DATE}
                            })

/*Sahil @04-may-19 starts*/

exports.EmployeeAssignItems = sequelize.define('employee_assign_items',{
                                    user_id:{type:Sequelize.INTEGER},
                                    employee_id:{type:Sequelize.INTEGER},
                                    item_id:{type:Sequelize.INTEGER},
                                    status:{type:Sequelize.ENUM('active', 'inactive')},
                                    created_at:{type:Sequelize.DATE},
                                    updated_at:{type:Sequelize.DATE}
                                });

exports.EmployeeLoadedStockItems = sequelize.define('employee_loaded_stock_items',{
                                    user_id:{type:Sequelize.INTEGER},
                                    employee_id:{type:Sequelize.INTEGER},
                                    store_id:{type:Sequelize.INTEGER},
                                    item_id:{type:Sequelize.INTEGER},
                                    measurement_unit_id:{type:Sequelize.INTEGER},
                                    quantity:{type:Sequelize.INTEGER},
                                    created_at:{type:Sequelize.DATE},
                                    updated_at:{type:Sequelize.DATE}
                                });

exports.StockItems = sequelize.define('stock_items',{
                                    user_id:{type:Sequelize.INTEGER},
                                    store_id:{type:Sequelize.INTEGER},
                                    item_id:{type:Sequelize.INTEGER},
                                    measurement_unit_id:{type:Sequelize.INTEGER},
                                    quantity:{type:Sequelize.INTEGER},
                                    created_at:{type:Sequelize.DATE},
                                    updated_at:{type:Sequelize.DATE}
                                });

exports.EmployeeStockTakingRequests = sequelize.define('employee_stock_taking_requests',{
                                employee_id:{type:Sequelize.INTEGER},
                                user_id:{type:Sequelize.INTEGER},
                                store_id:{type:Sequelize.INTEGER},
                                total_diff_quantity:{type:Sequelize.INTEGER},
                                total_short_inc_value:{type:Sequelize.INTEGER},
                                request_status:{type:Sequelize.ENUM('requested', 'accepted', 'rejected')},
                                created_at:{type:Sequelize.DATE},
                                updated_at:{type:Sequelize.DATE}
                            })

exports.EmployeeStockTakingRequestItems = sequelize.define('employee_stock_taking_request_items',{
                                stock_taking_request_id:{type:Sequelize.INTEGER},
                                employee_id:{type:Sequelize.INTEGER},
                                user_id:{type:Sequelize.INTEGER},
                                store_id:{type:Sequelize.INTEGER},
                                item_id:{type:Sequelize.INTEGER},
                                measurement_unit_id:{type:Sequelize.INTEGER},
                                actual_quantity:{type:Sequelize.INTEGER},
                                desired_quantity:{type:Sequelize.INTEGER},
                                remaining_quantity:{type:Sequelize.INTEGER},
                                sub_total:{type:Sequelize.INTEGER},
                                request_status:{type:Sequelize.ENUM('requested', 'accepted', 'rejected')},
                                created_at:{type:Sequelize.DATE},
                                updated_at:{type:Sequelize.DATE}
                            })
/*Sahil @04-may-19 ends*/

exports.Stores = sequelize.define('stores',{
					user_id:{type:Sequelize.INTEGER},
					store_number:{type:Sequelize.STRING},
					store_name_en:{type:Sequelize.STRING},
					store_name_ar:{type:Sequelize.STRING},
					reference:{type:Sequelize.STRING},
					note:{type:Sequelize.STRING},
					status:{type:Sequelize.ENUM('active', 'inactive')},
					created_at:{type:Sequelize.DATE},
					updated_at:{type:Sequelize.DATE}
				});

exports.EmployeeLoadItemsRequestDetail = sequelize.define('employee_load_items_request_details',{ 
                                            user_id:{type:Sequelize.INTEGER},
                                            employee_id:{type:Sequelize.INTEGER},
                                            store_id:{type:Sequelize.INTEGER},
                                            salesman_store_id:{type:Sequelize.INTEGER},
                                            item_id:{type:Sequelize.INTEGER},
                                            load_request_id:{type:Sequelize.INTEGER},
                                            measurement_unit_id:{type:Sequelize.INTEGER},
                                            quantity:{type:Sequelize.INTEGER},
                                            request_status:{type:Sequelize.ENUM('pending', 'accepted','rejected')},
                                            created_at:{type:Sequelize.DATE}
                                        })


exports.EmployeeUnloadItemsRequestDetail = sequelize.define('employee_unload_items_request_details',{
                                                user_id:{type:Sequelize.INTEGER},
                                                employee_id:{type:Sequelize.INTEGER},
                                                store_id:{type:Sequelize.INTEGER},
                                                salesman_store_id:{type:Sequelize.INTEGER},
                                                item_id:{type:Sequelize.INTEGER},
                                                unload_request_id:{type:Sequelize.INTEGER},
                                                measurement_unit_id:{type:Sequelize.INTEGER},
                                                quantity:{type:Sequelize.INTEGER},
                                                request_status:{type:Sequelize.ENUM('pending', 'accepted')},
                                                created_at:{type:Sequelize.DATE}
                            })

exports.SalesOrderCartDetail = sequelize.define('sales_order_cart_details',{
                                    user_id:{type:Sequelize.INTEGER},
                                    employee_id:{type:Sequelize.INTEGER},
                                    customer_id:{type:Sequelize.INTEGER},
                                    item_id:{type:Sequelize.INTEGER},
                                    quantity:{type:Sequelize.STRING},
                                    unit_id:{type:Sequelize.INTEGER},
                                    total_price:{type:Sequelize.DOUBLE},
                                    total_price_before_tax:{type:Sequelize.DOUBLE},
                                    total_tax:{type:Sequelize.DOUBLE},
                                    tax_type:{type:Sequelize.ENUM('value','percentage','NA')},
                                    base_price_per_unit:{type:Sequelize.DOUBLE},
                                    total_price_with_tax:{type:Sequelize.DOUBLE},
                                    created_at:{type:Sequelize.DATE},
                                    updated_at:{type:Sequelize.DATE}
                })

exports.SalesOrderCartPromotion = sequelize.define('sales_order_cart_promotions',{
                                    sales_order_cart_id:{type:Sequelize.INTEGER},
                                    discount_type:{type:Sequelize.ENUM('value','percentage','NA')},
                                    discount_percentage:{type:Sequelize.DOUBLE},
                                    discount_amount:{type:Sequelize.DOUBLE},
                                    promotion_id:{type:Sequelize.INTEGER},
                                    promotion_type:{type:Sequelize.ENUM('NA','range', 'package')},
                                    promotion_bonus_item_id:{type:Sequelize.INTEGER},
                                    promotion_bonus_quantity:{type:Sequelize.INTEGER},
                                    created_at:{type:Sequelize.DATE},
                                    updated_at:{type:Sequelize.DATE}
                })

exports.priceListItems = sequelize.define('price_list_items',{
                            price_list_id:{type:Sequelize.INTEGER},
                            user_id:{type:Sequelize.INTEGER},
                            item_id:{type:Sequelize.INTEGER},
                            selling_price:{type:Sequelize.STRING},
                            to_price:{type:Sequelize.STRING},
                            discount:{type:Sequelize.DOUBLE},
                            tax_status:{type:Sequelize.ENUM('yes', 'no')},
                            use_in_sales:{type:Sequelize.ENUM('yes', 'no')},
                            use_in_return:{type:Sequelize.ENUM('yes', 'no')},
                            created_at:{type:Sequelize.DATE},
                            updated_at:{type:Sequelize.DATE}
                        })


exports.ItemPriceLists = sequelize.define('item_price_lists',{
                            user_id:{type:Sequelize.INTEGER},
                            name:{type:Sequelize.STRING},
                            note:{type:Sequelize.STRING},
                            start_date:{type:Sequelize.DATE},
                            end_date:{type:Sequelize.DATE},
                            status:{type:Sequelize.ENUM('active', 'inactive')},
                            created_at:{type:Sequelize.DATE},
                            updated_at:{type:Sequelize.DATE}
                        })

exports.SalesOrderRequest = sequelize.define('sales_order_requests',{
                                    user_id:{type:Sequelize.INTEGER},
                                    request_level:{type:Sequelize.INTEGER},
                                    request_type:{type:Sequelize.ENUM('sales', 'invoice')},
                                    employee_id:{type:Sequelize.INTEGER},
                                    customer_id:{type:Sequelize.INTEGER},
                                    store_id:{type:Sequelize.INTEGER},
                                    supervisor_id:{type:Sequelize.INTEGER},
                                    salesmanager_id:{type:Sequelize.INTEGER},
                                    no_of_items:{type:Sequelize.STRING},
	                                supervisor_note:{type:Sequelize.STRING},
                                    salesmanager_note:{type:Sequelize.STRING},
                                    total_price_without_tax_discount:{type:Sequelize.DOUBLE},
                                    total_tax:{type:Sequelize.DOUBLE},
                                    total_discount:{type:Sequelize.DOUBLE},
	                                total_price:{type:Sequelize.DOUBLE},
                                    request_status:{type:Sequelize.ENUM('pending', 'accepted')},
                                    salesmanager_status:{type:Sequelize.ENUM('NA','pending', 'accepted','rejected')},
                                    supervisor_status:{type:Sequelize.ENUM('pending', 'accepted')},
                                    created_at:{type:Sequelize.DATE},
                                    updated_at:{type:Sequelize.DATE}
                            })

exports.EmployeeJourneys = sequelize.define('employee_journeys',{
                            user_id:{type:Sequelize.INTEGER},
                            employee_id:{type:Sequelize.INTEGER},
                            start_date_time:{type:Sequelize.DATE},
                            end_date_time:{type:Sequelize.DATE},
                            battery_life:{type:Sequelize.INTEGER},
                            android_version:{type:Sequelize.STRING},
                            latitude:{type:Sequelize.STRING},
                            longitude:{type:Sequelize.STRING},
                            current_journey_status:{type:Sequelize.ENUM('started', 'ended')},
                            created_at:{type:Sequelize.DATE},
                            updated_at:{type:Sequelize.DATE}
                        });

exports.SalesOrderRequestDetail = sequelize.define('sales_order_request_details',{ 
	                                user_id:{type:Sequelize.INTEGER},
	                                employee_id:{type:Sequelize.INTEGER},
                                    store_id:{type:Sequelize.INTEGER},
	                                item_id:{type:Sequelize.INTEGER},
	                                sales_order_request_id:{type:Sequelize.INTEGER},
                                    measurement_unit_id:{type:Sequelize.INTEGER},
	                                base_price_per_unit:{type:Sequelize.DOUBLE},
	                                quantity:{type:Sequelize.INTEGER},
                                    total_price:{type:Sequelize.DOUBLE},
                                    total_price_before_tax:{type:Sequelize.DOUBLE},
                                    total_tax:{type:Sequelize.DOUBLE},
                                    tax_type:{type:Sequelize.ENUM('value','percentage','NA')},
                                    total_price_with_tax:{type:Sequelize.DOUBLE},
	                                request_status:{type:Sequelize.ENUM('pending', 'accepted','rejected')},
	                                created_at:{type:Sequelize.DATE}
	                            })

exports.SalesOrderRequestDetailPromotion = sequelize.define('sales_order_request_detail_promotions',{
                                                sales_order_request_detail_id:{type:Sequelize.INTEGER},
                                                discount_type:{type:Sequelize.ENUM('value','percentage','NA')},
                                                discount_percentage:{type:Sequelize.DOUBLE},
                                                discount_amount:{type:Sequelize.DOUBLE},
                                                promotion_id:{type:Sequelize.INTEGER},
                                                promotion_type:{type:Sequelize.ENUM('NA','range', 'package', 'quantity', 'value')},
                                                promotion_bonus_item_id:{type:Sequelize.INTEGER},
                                                promotion_bonus_quantity:{type:Sequelize.INTEGER},
                                                measurement_unit_id:{type:Sequelize.INTEGER},
                                                created_at:{type:Sequelize.DATE},
                                                updated_at:{type:Sequelize.DATE}
                                            })

exports.RequestLevelControls = sequelize.define('request_level_controls',{ 
                                    user_id:{type:Sequelize.INTEGER},
                                    request_type:{type:Sequelize.ENUM('load','unload','sales')},
                                    level:{type:Sequelize.INTEGER},
                                    created_at:{type:Sequelize.DATE},
                                    updated_at:{type:Sequelize.DATE}
                                })

exports.Promotions = sequelize.define('promotions',{
						user_id:{type:Sequelize.INTEGER},
						name:{type:Sequelize.STRING},
						promotion_type:{type:Sequelize.ENUM('range', 'package')},
                        priority_id:{type:Sequelize.INTEGER},
                        priority:{type:Sequelize.INTEGER},
						category_id:{type:Sequelize.INTEGER},
						subcategory_id:{type:Sequelize.INTEGER},
                        subcategory2_id:{type:Sequelize.INTEGER},
                        bonus_qty:{type:Sequelize.INTEGER},
						minimum_quantity_value:{type:Sequelize.INTEGER},
						start_date_time:{type:Sequelize.DATE},
						end_date_time:{type:Sequelize.DATE},
						valid_for:{type:Sequelize.ENUM('invoice', 'return_invoice', 'both')},
						strictly_listed_item:{type:Sequelize.ENUM('yes','no')},
						// double_bonus:{type:Sequelize.ENUM('yes','no')},
						discount:{type:Sequelize.DOUBLE},
						discount_type:{type:Sequelize.ENUM('percentage', 'value')},
						invoice_per_salesman:{type:Sequelize.STRING},
						invoice_per_customer:{type:Sequelize.STRING},
						status:{type:Sequelize.ENUM('active', 'inactive')},
						created_at:{type:Sequelize.DATE},
						updated_at:{type:Sequelize.DATE}
					})
//range promotion items table
exports.PromotionsRangeGroupsItems = sequelize.define('promotions_range_groups_items',{
										user_id:{type:Sequelize.INTEGER},
										range_group_id:{type:Sequelize.INTEGER},
										main_item_id:{type:Sequelize.INTEGER},
										minimum_quantity:{type:Sequelize.DOUBLE},
										maximum_quantity:{type:Sequelize.DOUBLE},
										main_item_unit_id:{type:Sequelize.INTEGER},
										free_item_id:{type:Sequelize.INTEGER},
										free_item_quantity:{type:Sequelize.DOUBLE},
										free_unit_id:{type:Sequelize.INTEGER},
										created_at:{type:Sequelize.DATE},
										updated_at:{type:Sequelize.DATE}
									})

//package promotion items table
exports.PackagePromotionItems = sequelize.define('package_promotion_items',{
										user_id:{type:Sequelize.INTEGER},
										package_promotion_id:{type:Sequelize.INTEGER},
										item_id:{type:Sequelize.INTEGER},
										measurement_unit_id:{type:Sequelize.INTEGER},
										created_at:{type:Sequelize.DATE},
										updated_at:{type:Sequelize.DATE}
									})

//quantity promotion items table
exports.QuantityPromotionItems = sequelize.define('quantity_promotion_items',{
                                        user_id:{type:Sequelize.INTEGER},
                                        qty_promotion_id:{type:Sequelize.INTEGER},
                                        item_id:{type:Sequelize.INTEGER},
                                        measurement_unit_id:{type:Sequelize.INTEGER},
                                        created_at:{type:Sequelize.DATE},
                                        updated_at:{type:Sequelize.DATE}
                                    })

exports.OutputQuantityPromotionItems = sequelize.define('output_quantity_promotion_items',{
                                        user_id:{type:Sequelize.INTEGER},
                                        qty_promotion_id:{type:Sequelize.INTEGER},
                                        item_id:{type:Sequelize.INTEGER},
                                        measurement_unit_id:{type:Sequelize.INTEGER},
                                        created_at:{type:Sequelize.DATE},
                                        updated_at:{type:Sequelize.DATE}
                                    })

exports.CustomerPayments = sequelize.define('customer_payments',{
                                        user_id:{type:Sequelize.INTEGER},
                                        employee_id:{type:Sequelize.INTEGER},
                                        customer_id:{type:Sequelize.INTEGER},
                                        payment_type:{type:Sequelize.ENUM('cash','cheque')},
                                        amount:{type:Sequelize.DOUBLE},
                                        bank_id:{type:Sequelize.INTEGER},
                                        branch_id:{type:Sequelize.INTEGER},
                                        drawer_name:{type:Sequelize.STRING},
                                        cheque_no:{type:Sequelize.STRING},
                                        due_date:{type:Sequelize.DATE},
                                        note:{type:Sequelize.STRING},
                                        image:{type:Sequelize.STRING},
                                        created_at:{type:Sequelize.DATE},
                                        updated_at:{type:Sequelize.DATE}
                                    })

//gcm devices
exports.GcmDevices = sequelize.define('gcm_devices',{
                            user_id:{type:Sequelize.INTEGER},
                            employee_id:{type:Sequelize.INTEGER},
                            device_id:{type:Sequelize.STRING},
                            device_token:{type:Sequelize.STRING},
                            created_at:{type:Sequelize.DATE},
                            updated_at:{type:Sequelize.DATE}
                        })