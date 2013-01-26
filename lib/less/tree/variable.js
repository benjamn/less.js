(function (tree) {

tree.Variable = function (name, index, file) { this.name = name, this.index = index, this.file = file };
tree.Variable.prototype = {
    eval: function (env) {
        var variable, name = this.name;

        if (name.indexOf('@@') == 0) {
            name = '@' + new(tree.Variable)(name.slice(1)).eval(env).value;
        }
        
        if (this.evaluating) {
            throw { type: 'Name',
                    message: "Recursive variable definition for " + name,
                    filename: this.file,
                    index: this.index };
        }
        
        this.evaluating = true;

        if (variable = tree.find(env.frames, function (frame) {
            var rule = frame.variable(name);
            if (rule) {
                var value = rule.value.eval(env);
                if (env.variables) {
                    env.variables[name] = value.toCSS(env);
                }
                return value;
            }
        })) { 
            this.evaluating = false;
            return variable;
        }
        else {
            throw { type: 'Name',
                    message: "variable " + name + " is undefined",
                    filename: this.file,
                    index: this.index };
        }
    }
};

})(require('../tree'));
