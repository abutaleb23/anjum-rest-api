var express=require('express');
var app=express();
var routes=require('./routes/index.js');
var bodyParser=require('body-parser');
var fileUpload = require('express-fileupload');

app.use(bodyParser.json({limit: '1000mb'}));

app.use(bodyParser.urlencoded({limit: '1000mb', extended: true }));

app.use(fileUpload());

app.get('/', routes.home);

app.post('/employee/login', routes.employee_login);
app.post('/employee/logout', routes.employee_logout);
app.post('/employee/update_device_id', routes.employee_update_device_id);
app.post('/employee/categoriesList', routes.categories_list);
app.get('/employee/allCustomers', routes.emloyeeAllCustomers);
app.get('/employee/subCategoriesList', routes.sub_categories_list);
app.post('/employee/startEndEmployeeVisit', routes.start_end_employee_visit);
app.post('/employee/addPhotoDuringVisit', routes.add_photo_during_visit);
app.post('/employee/addNoteDuringVisit', routes.add_note_during_visit);
app.get('/employee/currentRunningVisit', routes.current_running_visit);
app.post('/employee/allItemsList', routes.all_items_list);
app.post('/employee/timeline', routes.employee_timeline);
app.post('/employee/addBeforeAfterPhotoDuringVisit', routes.add_before_after_photo_during_visit);
app.post('/employee/addCustomer', routes.employee_add_customer);
app.get('/employee/allStates', routes.get_states);
app.get('/employee/myPermissions', routes.employee_all_permissions);
app.get('/employee/allCities', routes.all_cities);
app.get('/employee/allCustomerTypes', routes.all_customer_types);
app.get('/employee/allBanks', routes.all_banks);
app.get('/employee/allBranches', routes.all_branches);

app.post('/employee/loadItemsToCart', routes.load_items_to_cart);
app.post('/employee/unloadItemsFromCart', routes.unload_items_from_cart);
app.post('/employee/loadItemsRequest', routes.load_items_request_submit);
app.post('/employee/unloadItemsRequest', routes.unload_items_request_submit);
app.post('/employee/fetchLoadItemsCart', routes.fetch_load_items_cart);
app.post('/employee/fetchUnloadItemsCart', routes.fetch_unload_items_cart);
app.post('/employee/fetchOneLoadItemCart', routes.fetch_one_load_item_cart);
app.post('/employee/fetchOneUnloadItemCart', routes.fetch_one_unload_items_cart);
app.post('/employee/deleteLoadItemFromCart', routes.delete_load_item_from_cart);
app.post('/employee/deleteUnloadItemFromCart', routes.delete_unload_item_from_cart);
app.post('/employee/checkStockCashavn', routes.check_stock_cashavn);
app.get('/employee/getStores', routes.get_stores);
app.post('/employee/employeePermissions', routes.get_employee_permissions);

app.post('/employee/getLoadRequestsList', routes.get_load_requests_list);
// selected
app.post('/employee/loadRequestChangeStatusSupervisor', routes.load_request_change_status_supervisor);
app.post('/employee/getParticularItemDetail', routes.get_particular_item_detail);
app.post('/employee/getAllEmployeesUnderSupervisor', routes.get_all_employees_under_supervisor);
// selected
app.post('/employee/supervisorModifyLoadRequestItem', routes.supervisor_modify_load_request_item);
// selected
app.post('/employee/getLoadRequestItemsList', routes.get_load_request_items_list);

app.post('/employee/getUnloadRequestsList', routes.get_unload_requests_list);
app.post('/employee/unloadRequestChangeStatusSupervisor', routes.unload_request_change_status_supervisor);
app.post('/employee/supervisorDeleteLoadRequestItem', routes.supervisor_delete_load_request_item);
app.post('/employee/supervisorModifyUnloadRequestItem', routes.supervisor_modify_unload_request_item);
app.post('/employee/supervisorDeleteUnloadRequestItem', routes.supervisor_delete_unload_request_item);
app.post('/employee/getUnloadRequestItemsList', routes.get_unload_request_items_list);

/*Sahil @16-april-19 starts*/
app.post('/employee/addItemsToSalesCart', routes.add_items_to_sales_cart);
// for cart and for view details in supervisor exceed limit request list
app.post('/employee/salesCartItemsList', routes.sales_cart_items_list); 
app.post('/employee/deleteSalesCartItems', routes.delete_sales_cart_items);
app.post('/employee/deleteAllSalesCartItems', routes.delete_all_sales_cart_items);


/* 
	updating features for invoice and return invoice
	by: Habibur Rahman	

*/
app.post('/employee/adjustItemsFromSalesCart', routes.adjust_items_from_sales_cart);
app.post('/employee/customers-payment-method', routes.customer_payment_method) 
app.post('/employee/customers-take-supervisor-permission', routes.customer_take_supervisor_permission)
app.post('/employee/customers-cart-supervisor-status', routes.customer_cart_supervisor_status)
app.post('/employee/supervisor-accept-customers-credit-limit-exceed-request', routes.supervisor_accept_customer_credit_limit_exceed_request)
app.post('/employee/supervisor-reject-customers-credit-limit-exceed-request', routes.supervisor_reject_customer_credit_limit_exceed_request)
app.post('/employee/customers-set-currency', routes.customer_set_currency)
app.post('/employee/getCreditLimitExceedRequestsList', routes.get_credit_limit_exceed_requests_list)
app.post('/employee/customers-stock-quantity-permission-status', routes.customer_stock_quantity_permission_status)

app.get('/employee/customers-available-get-currencies', routes.customer_available_get_currencies)


/*Sahil @16-april-19 ends*/
app.post('/employee/editSalesCartItem', routes.edit_sales_cart_items);
app.post('/employee/allItemsAccordinToCustomerPrice', routes.all_items_according_customer_price);

app.post('/employee/startEndEmployeeJourney', routes.start_end_employee_journey);

app.post('/employee/salesOrderRequestSubmit', routes.sales_order_request_submit);
app.post('/employee/salesOrderCartRemoveItem', routes.sales_order_cart_remove_item);
app.post('/employee/getRequestLevels', routes.get_request_levels);
app.post('/employee/getSalesOrderRequestsList', routes.get_sales_order_requests_list);

app.post('/employee/salesRequestChangeStatusSupervisor', routes.sales_request_change_status_supervisor);
app.post('/employee/salesRequestChangeStatusSalesmanager', routes.sales_request_change_status_salesmanager);
app.post('/employee/loadRequestChangeStatusSalesmanager', routes.load_request_change_status_salesmanager);
app.post('/employee/unloadRequestChangeStatusSalesmanager', routes.unload_request_change_status_salesmanager);
app.post('/employee/getAllSupervisorsUnderSalesmanager', routes.get_all_supervisors_under_salesmanager);
app.post('/employee/getSalesOrderRequestItemsList', routes.get_sales_order_request_items_list);

app.post('/employee/getStoreStockList', routes.get_store_stock_list);
app.post('/employee/updateStoreStock', routes.update_store_stock);
app.post('/employee/stockTakingRequests', routes.stock_taking_requests);
app.post('/employee/checkStockItemQuantity', routes.check_stock_item_quantity);

app.post('/employee/getUserBanks', routes.get_user_banks);
app.post('/employee/getUserBankBranches', routes.get_user_bank_branches);
app.post('/employee/getCustomerBankBranchDrawers', routes.get_customer_bank_branch_drawers);
app.post('/employee/submitPayment', routes.submit_payment);
app.post('/employee/getCustomerPaymentList', routes.get_customer_payment_list);

app.post('/employee/timelineForSalesman', routes.timeline_for_salesman);
app.post('/employee/timelineForSpecificCustomer', routes.timeline_for_specific_customer);
app.post('/employee/timelineDetail', routes.timeline_detail);
app.post('/employee/galleryTimeline', routes.gallery_timeline);

app.post('/employee/getTasks', routes.get_tasks);
app.post('/employee/taskSeen', routes.task_seen);
app.post('/employee/taskCompleted', routes.task_completed);

app.post('/employee/getSurveys', routes.get_surveys);
app.post('/employee/getSurveyQuestions', routes.get_survey_questions);
app.post('/employee/submitSurvey', routes.submit_survey);

app.post('/employee/invoiceReports', routes.invoice_reports);
app.post('/employee/paymentReport', routes.payment_report);
app.post('/employee/visitNotesReport', routes.visit_notes_report);
app.post('/employee/visitPhotosReport', routes.visit_photos_report);
app.post('/employee/visitBeforeAfterPhotosReport', routes.visit_before_after_photos_report);
app.post('/employee/tasksReport', routes.tasks_report);
app.post('/employee/surveysReport', routes.surveys_report);
app.post('/employee/salesOrderReport', routes.sales_order_report);
app.post('/employee/invoiceReport', routes.invoice_report);
app.post('/employee/returnInvoiceReport', routes.return_invoice_report);
app.post('/employee/netPaymentReport', routes.net_payment_report);
app.post('/employee/netSalesReport', routes.net_sales_report);
app.post('/employee/getPrintData', routes.get_print_data);
app.post('/employee/getTargetCategories', routes.get_target_categories);
app.post('/employee/getCategoryData', routes.get_category_data);
app.post('/employee/getPaymentData', routes.get_payment_data);
app.post('/employee/getRoutes', routes.get_routes);
app.post('/employee/getItemDetails', routes.get_item_details);
app.post('/employee/getRouteCustomers', routes.get_route_customers);
app.post('/employee/getAccountStatement', routes.get_account_statement);
app.post('/employee/sendAccountStatementToCustomer', routes.send_account_statement_to_customer);

//promotion section start@05-jun
app.post('/employee/promo/allPromotionsAccordingToItem', routes.all_promotions_according_to_item);
app.post('/employee/promo/itemsAccordingToRangePromotions', routes.items_according_to_range_promotion);
app.post('/employee/promo/getSinglePromotionItemDetail', routes.get_single_promotion_item_detail);
app.post('/employee/promo/quantityValueAccordingToItem', routes.quantity_value_according_to_item);
app.post('/employee/promo/promotionOutputItemsDetails', routes.promotion_output_items_details);
//promotion section end
app.post('/employee/saveFcmToken', routes.save_fcm_token);
app.post('/employee/removeFcmToken', routes.remove_fcm_token);
// app.get('/testing', routes.testing);

server=app.listen(3002,function(){
	var port = server.address().port;
	console.log('Running on port no. '+port);
})