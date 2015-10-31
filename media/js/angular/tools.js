app.directive("ngFileSelect", function () {
    return {
        link: function (scope, el) {
            el.bind("change", function (e) {
                scope.file = (e.srcElement || e.target).files[0];
                scope.getFile();
            })
        }
    }
});

app.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                    });
                };
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
}]);