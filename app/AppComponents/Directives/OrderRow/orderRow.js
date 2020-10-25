app.directive('orderRow', () => {
    return {
        scope: {
            order: '=',
            orderIndex: '@',
            orderData: '='
        },
        controller: 'OrdersController',
        templateUrl: '/AppComponents/Directives/OrderRow/orderRow.html'
    }
});