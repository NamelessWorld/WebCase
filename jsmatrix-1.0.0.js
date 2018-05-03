/*!
* [Wed May 02 2018 11:02:01 GMT+0800 (CST)]
*/
/*!
 *
 * JsMatrix - A tool library for matrix operation implemented in JavaScript language.
 * https://github.com/yelloxing/JsMatrix
 * 
 * author yelloxing 心叶
 * 
 * version v1.0.0
 * 
 * build 2018/04/21
 *
 * Copyright yelloxing
 * Released under the MIT license
 * 
 **************************************************************
 * 
 * 第一段：JsMatrix和Determinant关系
 * 
 * 全局存在二个对象JsMatrix和Determinant，前者代表一个矩阵，后者代表一个方矩阵，是前置的孩子；
 * 因此后者对象可以调用前者对象上的方法，因为方矩阵本质也是矩阵。
 * 
 * 此外，JsMatrix挂载在window下，而Determinant挂载在JsMatrix
 * 
 * 第二段：JsMatrix和Determinant对象的建立
 * 
 * JsMatrix对象建立请使用：JsMatrix(param)，参数应该是一个二维矩阵数组
 * Determinant对象建立请使用：JsMatrix.Determinant(param)，参数应该是一个二维方矩阵数组
 * 
 * 第三段：使用
 * 
 * JsMatrix和Determinant本身和其建立的对象都提供了一系列方法，主要包括一下方面（具体的代码中有备注）：
 * 
 * 1.矩阵的计算方法；
 * 2.行列式的计算方法；
 * 3.一些移动，缩放和旋转等变换的方法和获取变换矩阵的方法；
 * 4.矩阵和行列式的操作（比如初等变换，拼接和替换等等）。
 *
 */
(function (global, factory, undefined) {
    'use strict';

    if (global && global.document) {
        factory(global);
    } else if (typeof module === "object" && typeof module.exports === "object") {
        exports = module.exports = factory(global);
    } else {
        throw new Error("Unexcepted Error!");
    }

})(typeof window !== "undefined" ? window : this, function (global, undefined) {
    'use strict';

    var JsMatrix = function (rowNum, colNum) {
        return new JsMatrix.prototype.init(rowNum, colNum);
    };

    /**
     * 
     * @param {number:矩阵的行数} rowNum 
     * @param {number:矩阵的列数} colNum 
     * 
     * 除了上面传入行数和列数初始化一个空白矩阵，还可以：
     * 1.传入一个二维数组（也就是记录了数据的矩阵）
     * 2.传入JsMatrix对象
     */
    JsMatrix.prototype.init = function (rowNum, colNum) {

        // 如果是建立空白矩阵【不支持传入Number对象】
        if (rowNum && colNum && 'number' == typeof rowNum && 'number' == typeof colNum) {
            this.value = [];
            var row, col;
            for (row = 0; row < rowNum; row++) {
                this.value[row] = [];
                for (col = 0; col < colNum; col++) {
                    this.value[row][col] = 0;
                }
            }
            this.row = rowNum;
            this.col = colNum;
            // 如果是二维数组
        } else if (rowNum && !colNum && rowNum instanceof Array) {
            this.value = [];
            var row, col, colLength;
            for (row = 0; row < rowNum.length; row++) {
                if (!(rowNum[row] instanceof Array)) {
                    throw new Error('Matrix[' + row + '] is not an array!');
                }
                if (0 == row) {
                    colLength = rowNum[0].length;
                } else if (rowNum[row].length != colLength) {
                    // 如果存在一行元素个数和第一行不一样
                    throw new Error('This is not a MatrixArray!');
                }
                this.value[row] = [];
                for (col = 0; col < rowNum[row].length; col++) {
                    if ('number' != typeof rowNum[row][col]) {
                        throw new Error('Matrix[' + row + '][' + col + '] is not a number!');
                    }
                    this.value[row][col] = rowNum[row][col];
                }
            }
            this.row = this.value.length;
            this.col = colLength;
            // 如果是JsMatrix对象
        } else if (rowNum && rowNum.isMatrix) {
            this.row = rowNum.row;
            this.col = rowNum.col;
            this.value = rowNum.value;
        } else {
            throw new Error("Initialization matrix parameter unlawfully!");
        }

        if (!this.row || !this.col) {
            throw new Error("Unlawful initialization of data!");
        }

        this.isMatrix = true;

        return this;

    };

    JsMatrix.prototype.extend = JsMatrix.extend = function () {

        var target = arguments[0] || {};
        var source = arguments[1] || {};
        var length = arguments.length;

        /*
         * 确定复制目标和源
         */
        if (length === 1) {
            //如果只有一个参数，目标对象是自己
            source = target;
            target = this;
        }
        if (typeof target !== "object" && typeof target !== 'function') {
            //如果目标不是对象或函数，则初始化为空对象
            target = {};
        }

        /*
         * 复制属性到对象上面
         */
        for (var key in source) {
            try {
                if (target[key] == source[key]) {
                    throw new Error('The object already has the an attribute ' + key + '!');
                }
                target[key] = source[key];
            } catch (e) {
                throw new Error("Illegal property value！");
            }
        }

        return target;
    };

    JsMatrix.prototype.init.prototype = JsMatrix.prototype;

    // 一些项目信息
    JsMatrix.prototype.author = 'yelloxing';
    JsMatrix.prototype.description = 'A tool library for matrix operation implemented in JavaScript language';
    JsMatrix.prototype.build = '2018/04/21 NanJin';

    JsMatrix.version = 'v1.0.0';

    global.JsMatrix = JsMatrix;

    return JsMatrix;
});
/*!======= fundamental.js =======*/
(function (JsMatrix, undefined) {

    // 扩展JsMatrix对象上的方法
    JsMatrix.prototype.extend({

        // 矩阵加法
        'add': function (jsMatrix) {
            jsMatrix = JsMatrix(jsMatrix);
            if (jsMatrix.row == this.row && jsMatrix.col == this.col) {
                var row, col;
                for (row = 0; row < this.row; row++) {
                    for (col = 0; col < this.col; col++) {
                        this.value[row][col] += jsMatrix.value[row][col];
                    }
                }
            } else {
                throw new Error('Matrix addition must ensure that the number of rows and columns of the two matrices is the same!');
            }
            return this;
        },

        // 矩阵减法
        'minus': function (jsMatrix) {
            jsMatrix = JsMatrix(jsMatrix);
            if (jsMatrix.row == this.row && jsMatrix.col == this.col) {
                var row, col;
                for (row = 0; row < this.row; row++) {
                    for (col = 0; col < this.col; col++) {
                        this.value[row][col] -= jsMatrix.value[row][col];
                    }
                }
            } else {
                throw new Error('Matrix subtraction must ensure that the number of rows and columns of the two matrices is the same!');
            }
            return this;
        },

        // 矩阵乘法
        'mult': function (jsMatrix) {
            jsMatrix = JsMatrix(jsMatrix);
            if(this.isDeterminant && jsMatrix.row!=jsMatrix.col){
                throw new Error('The parameter should be a square array!');
            }
            if (jsMatrix.row == this.col) {
                var row, col, targetMatrix = [], flag;
                for (row = 0; row < this.row; row++) {
                    targetMatrix[row] = [];
                    for (col = 0; col < jsMatrix.col; col++) {
                        // 计算新矩阵的值
                        targetMatrix[row][col] = 0;
                        for (flag = 0; flag < this.col; flag++) {
                            targetMatrix[row][col] += (this.value[row][flag] * jsMatrix.value[flag][col]);
                        }
                    }
                }
                this.col = jsMatrix.col;
                this.value = targetMatrix;
            } else {
                throw new Error('Matrix multiplication must ensure that the number of columns in the previous matrix is equal to the number of rows in the last matrix!');
            }
            return this;
        },

        // 矩阵转置
        'invert': function () {
            var value = [], row, col;
            for (row = 0; row < this.col; row++) {
                value[row] = [];
                for (col = 0; col < this.row; col++) {
                    value[row][col] = this.value[col][row];
                }
            }
            this.value = value;
            // 交互行数和列数
            this.row = this.row + this.col;
            this.col = this.row - this.col;
            this.row = this.row - this.col;
            return this;
        }

    });

})((typeof window !== "undefined" ? window : this).JsMatrix);
/*!======= tool.js =======*/
(function (JsMatrix, undefined) {

    // 扩展JsMatrix类上的方法
    JsMatrix.extend({

        // 复制生成一个新的矩阵对象
        'clone': function (jsMatrix) {
            if (!jsMatrix.isMatrix) {
                throw new Error('The object that needs to be cloned must be a matrix object!');
            }
            var tempArray = [], row, col;
            for (row = 0; row < jsMatrix.row; row++) {
                tempArray[row] = [];
                for (col = 0; col < jsMatrix.col; col++) {
                    tempArray[row][col] = jsMatrix.value[row][col];
                }
            }
            if (jsMatrix.isDeterminant) {
                return Determinant(tempArray);
            } else {
                return JsMatrix(tempArray);
            }
        }

    });

})((typeof window !== "undefined" ? window : this).JsMatrix);
/*!======= determinant.core.js =======*/
(function (JsMatrix, undefined) {

    var Determinant = function (size) {
        return new Determinant.prototype.init(size);
    };

    // 这里是为了可以使用矩阵对象的方法
    var Matrix = function () { };
    Matrix.prototype = JsMatrix.prototype;
    Determinant.prototype = new Matrix();

    Determinant.prototype.init = function (size) {
        if (size && 'number' == typeof size) {
            this.value = [];
            var row, col;
            for (row = 0; row < size; row++) {
                this.value[row] = [];
                for (col = 0; col < size; col++) {
                    this.value[row][col] = row == col ? 1 : 0;
                }
            }
            this.size = size;
        } else if (size && size instanceof Array) {
            this.value = [];
            this.size = size.length;
            var row, col;
            for (row = 0; row < this.size; row++) {
                if (!(size[row] instanceof Array)) {
                    throw new Error('Determinant[' + row + '] is not an array!');
                }
                if (size[row].length != this.size) {
                    // 行列式看起来应该是正方形
                    throw new Error('This is not a DeterminantArray!');
                }
                this.value[row] = [];
                for (col = 0; col < this.size; col++) {
                    if ('number' != typeof size[row][col]) {
                        throw new Error('Determinant[' + row + '][' + col + '] is not a number!');
                    }
                    this.value[row][col] = size[row][col];
                }
            }
        } else {
            throw new Error("Initialization of determinant parameters illegal!");
        }
        this.col = this.row = this.size;
        this.isDeterminant = true;
        this.isMatrix = true;
        if(!this.size){
            throw new Error("Unlawful initialization of data!");
        }
        return this;
    };

    Determinant.extend=Determinant.prototype.extend;

    Determinant.prototype.author = JsMatrix.prototype.author;
    Determinant.prototype.description = JsMatrix.prototype.description;
    Determinant.prototype.build = JsMatrix.prototype.build;

    Determinant.prototype.init.prototype = Determinant.prototype;

    JsMatrix.Determinant = Determinant;

})((typeof window !== "undefined" ? window : this).JsMatrix);
/*!======= determinant.fundamental.js =======*/
(function (Determinant, undefined) {

    // 扩展行列式对象上的方法
    Determinant.prototype.extend({

        //获取余子式[rows和cols方便是一个一纬数组，代表需要删除的全部行和列]
        //不修改this对象的值
        'getCofactor': function (rows, cols) {
            var rowsObj = { 'length': 0 }, colsObj = { 'length': 0 }, flag, row, col, determinant = [];
            // 把需要删除的行和列修改一下记录方式，方便使用
            for (flag = 0; flag < rows.length; flag++) {
                if (rows[flag] < 0 || rows[flag] >= this.size) {
                    throw new Error('Obtaining surplus subboundary!');
                }
                if (!rowsObj[rows[flag]]) {
                    rowsObj[rows[flag]] = true;
                    rowsObj.length++;
                }
            }
            for (flag = 0; flag < cols.length; flag++) {
                if (cols[flag] < 0 || cols[flag] >= this.size) {
                    throw new Error('Obtaining surplus subboundary!');
                }
                if (!colsObj[cols[flag]]) {
                    colsObj[cols[flag]] = true;
                    colsObj.length++;
                }
            }
            // 如果需要删除的行数不等于列数，非法
            if (rowsObj.length != colsObj.length) {
                throw new Error('The number of rows to be deleted should be equal to the number of columns!');
            }

            for (row = 0; row < this.size; row++) {
                if (!rowsObj[row]) {
                    determinant.push([]);
                    for (col = 0; col < this.size; col++) {
                        if (!colsObj[col]) {
                            determinant[determinant.length - 1].push(this.value[row][col]);
                        }
                    }
                }
            }
            return Determinant(determinant);
        },

        //计算行列式的值
        'calc': function () {
            if (this.size == 1) {
                return this.value[0][0];
            }
            if (this.size == 2) {
                return this.value[0][0] * this.value[1][1] - this.value[0][1] * this.value[1][0];
            }
            var resultData = 0, flag, link = 1;
            for (flag = 0; flag < this.size; flag++) {
                resultData += this.value[0][flag] * link * this.getCofactor([0], [flag]).calc();
                link = link == 1 ? -1 : 1;
            }
            return resultData;
        }

    });

})((typeof window !== "undefined" ? window : this).JsMatrix.Determinant);
/*!======= determinant.rotate.js =======*/
(function (Determinant, undefined) {

    // 扩展行列式类上的方法
    Determinant.extend({

        // 绕X轴旋转deg度，单位弧度[y->z方向]，坐标写法是垂直写法
        'rotateX': function (deg) {
            var sinDeg = Math.round(Math.sin(deg) * 1000) / 1000;
            var cosDeg = Math.round(Math.cos(deg) * 1000) / 1000;
            return Determinant([
                [1, 0, 0],
                [0, cosDeg, -sinDeg],
                [0, sinDeg, cosDeg]
            ]);
        },

        // 绕Y轴旋转deg度，单位弧度[z->x方向]，坐标写法是垂直写法
        'rotateY': function (deg) {
            var sinDeg = Math.round(Math.sin(deg) * 1000) / 1000;
            var cosDeg = Math.round(Math.cos(deg) * 1000) / 1000;
            return Determinant([
                [cosDeg, 0, sinDeg],
                [0, 1, 0],
                [-sinDeg, 0, cosDeg]
            ]);
        },

        // 绕Z轴旋转deg度，单位弧度[x->y方向]，坐标写法是垂直写法
        'rotateZ': function (deg) {
            var sinDeg = Math.round(Math.sin(deg) * 1000) / 1000;
            var cosDeg = Math.round(Math.cos(deg) * 1000) / 1000;
            return Determinant([
                [cosDeg, -sinDeg, 0],
                [sinDeg, cosDeg, 0],
                [0, 0, 1]
            ]);
        },

        // 围绕一条平行X轴的线（y,z）旋转deg度，单位弧度[y->z方向]，坐标写法是垂直写法
        'rotatePX': function (y, z, deg) {
            var sinDeg = Math.round(Math.sin(deg) * 1000) / 1000;
            var cosDeg = Math.round(Math.cos(deg) * 1000) / 1000;
            return Determinant([
                [1, 0, 0, 0],
                [0, cosDeg, -sinDeg, y - y * cosDeg + z * sinDeg],
                [0, sinDeg, cosDeg, z - y * sinDeg - z * cosDeg],
                [0, 0, 0, 0]
            ]);
        },

        // 围绕一条平行Y轴的线（z,x）旋转deg度，单位弧度[z->x方向]，坐标写法是垂直写法
        'rotatePY': function (z, x, deg) {
            var sinDeg = Math.round(Math.sin(deg) * 1000) / 1000;
            var cosDeg = Math.round(Math.cos(deg) * 1000) / 1000;
            return Determinant([
                [cosDeg, 0, sinDeg, x - z * sinDeg - x * cosDeg],
                [0, 1, 0, 0],
                [-sinDeg, 0, cosDeg, z - z * cosDeg + x * sinDeg],
                [0, 0, 0, 0]
            ]);
        },

        // 围绕一条平行Z轴的线（x,y）旋转deg度，单位弧度[x->y方向]，坐标写法是垂直写法
        'rotatePZ': function (x, y, deg) {
            var sinDeg = Math.round(Math.sin(deg) * 1000) / 1000;
            var cosDeg = Math.round(Math.cos(deg) * 1000) / 1000;
            return Determinant([
                [cosDeg, -sinDeg, 0, x - x * cosDeg + y * sinDeg],
                [sinDeg, cosDeg, 0, y - x * sinDeg - y * cosDeg],
                [0, 0, 1, 0],
                [0, 0, 0, 0]
            ]);
        }

    });

})((typeof window !== "undefined" ? window : this).JsMatrix.Determinant);
/*!======= determinant.scale.js =======*/
(function (Determinant, undefined) {

    // 扩展行列式类上的方法
    Determinant.extend({

        // 以原点为中心缩放rate倍，坐标写法可以是垂直写法或者水平写法
        'scaleOrigin': function (rate) {
            return Determinant([
                [rate, 0, 0],
                [0, rate, 0],
                [0, 0, rate]
            ]);
        },

        // 以指定的点(a,b,c)为中心缩放rate倍，坐标写法可以是垂直写法或者水平写法
        'scale': function (a, b, c, rate) {
            return Determinant([
                [rate, 0, 0, a - a * rate],
                [0, rate, 0, b - b * rate],
                [0, 0, rate, c - c * rate],
                [a - a * rate, b - b * rate, c - c * rate, 0]
            ]);
        }

    });

})((typeof window !== "undefined" ? window : this).JsMatrix.Determinant);
/*!======= determinant.move.js =======*/
(function (Determinant, undefined) {

    // 扩展行列式类上的方法
    Determinant.extend({

        // 沿着X轴方向移动，坐标写法可以是垂直写法或者水平写法的（x,y,z,1）
        'moveX': function (dis) {
            return Determinant([
                [1, 0, 0, dis],
                [0, 1, 0, 0],
                [0, 0, 1, 0],
                [dis, 0, 0, 0]
            ]);
        },

        // 沿着Y轴方向移动，坐标写法可以是垂直写法或者水平写法的（x,y,z,1）
        'moveY': function (dis) {
            return Determinant([
                [1, 0, 0, 0],
                [0, 1, 0, dis],
                [0, 0, 1, 0],
                [0, dis, 0, 0]
            ]);
        },

        // 沿着Z轴方向移动，坐标写法可以是垂直写法或者水平写法的（x,y,z,1）
        'moveZ': function (dis) {
            return Determinant([
                [1, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 1, dis],
                [0, 0, dis, 0]
            ]);
        },

        // 沿着从原点出发，经过(a.b.c)的一条射线移动，坐标写法可以是垂直写法或者水平写法的（x,y,z,1）
        'moveLine': function (a, b, c, dis) {
            var m = dis / (Math.sqrt(a * a + b * b + c * c));
            return Determinant([
                [1, 0, 0, a * m],
                [0, 1, 0, b * m],
                [0, 0, 1, c * m],
                [a * m, b * m, c * m, 0]
            ]);
        }

    });

})((typeof window !== "undefined" ? window : this).JsMatrix.Determinant);
/*!======= perspective.one.js =======*/
(function (JsMatrix, undefined) {

    // 扩展JsMatrix对象上的方法
    JsMatrix.prototype.extend({

        // 一点透视（需要传递一个参数来表示眼睛的位置）
        'perspectiveOne': function (x, y, z) {
            if (this.row == 3 && this.col == 1) {
                this.value = [[
                    x - z * (x - this.value[0][0]) / (z - this.value[2][0])
                ], [
                    y - z * (y - this.value[1][0]) / (z - this.value[2][0])
                ], [0]];
            } else if (this.row == 1 && this.col == 3) {
                this.value = [[
                    x - z * (x - this.value[0][0]) / (z - this.value[0][2])
                    ,
                    y - z * (y - this.value[0][1]) / (z - this.value[0][2])
                    ,
                    0]];
            } else {
                throw new Error('The coordinate transformation requires a coordinate matrix!');
            }
            return this;
        }

    });

})((typeof window !== "undefined" ? window : this).JsMatrix);
/*!======= rotate.js =======*/
(function (JsMatrix, undefined) {

    // 扩展JsMatrix对象上的方法
    JsMatrix.prototype.extend({

        // 绕X轴旋转deg度，单位弧度[y->z方向]
        'rotateX': function (deg) {
            if (this.row == 3 && this.col == 1) {
                this.value = JsMatrix.Determinant.rotateX(deg).mult(this).value;
            } else if (this.row == 1 && this.col == 3) {
                this.value = this.mult(JsMatrix.Determinant.rotateX(deg).invert()).value;
            } else {
                throw new Error('The coordinate transformation requires a coordinate matrix!');
            }
            return this;
        },

        // 绕Y轴旋转deg度，单位弧度[z->x方向]
        'rotateY': function (deg) {
            if (this.row == 3 && this.col == 1) {
                this.value = JsMatrix.Determinant.rotateY(deg).mult(this).value;
            } else if (this.row == 1 && this.col == 3) {
                this.value = this.mult(JsMatrix.Determinant.rotateY(deg).invert()).value;
            } else {
                throw new Error('The coordinate transformation requires a coordinate matrix!');
            }
            return this;
        },

        // 绕Z轴旋转deg度，单位弧度[x->y方向]
        'rotateZ': function (deg) {
            if (this.row == 3 && this.col == 1) {
                this.value = JsMatrix.Determinant.rotateZ(deg).mult(this).value;
            } else if (this.row == 1 && this.col == 3) {
                this.value = this.mult(JsMatrix.Determinant.rotateZ(deg).invert()).value;
            } else {
                throw new Error('The coordinate transformation requires a coordinate matrix!');
            }
            return this;
        },

        // 围绕一条平行X轴的线（y,z）旋转deg度，单位弧度[y->z方向]
        'rotatePX': function (y, z, deg) {
            if (this.row == 3 && this.col == 1) {
                this.value[3] = [1];
                this.row = 4;
                this.value = JsMatrix.Determinant.rotatePX(y, z, deg).mult(this).value;
                delete this.value[3];
                this.row = 3;
            } else if (this.row == 1 && this.col == 3) {
                this.value[0][3] = 1;
                this.col = 4;
                this.value = this.mult(JsMatrix.Determinant.rotatePX(y, z, deg).invert()).value;
                this.value[0].length = 3;
                this.col = 3;
            } else {
                throw new Error('The coordinate transformation requires a coordinate matrix!');
            }
            return this;
        },

        // 围绕一条平行Y轴的线（z,x）旋转deg度，单位弧度[z->x方向]
        'rotatePY': function (z, x, deg) {
            if (this.row == 3 && this.col == 1) {
                this.value[3] = [1];
                this.row = 4;
                this.value = JsMatrix.Determinant.rotatePY(z, x, deg).mult(this).value;
                delete this.value[3];
                this.row = 3;
            } else if (this.row == 1 && this.col == 3) {
                this.value[0][3] = 1;
                this.col = 4;
                this.value = this.mult(JsMatrix.Determinant.rotatePY(z, x, deg).invert()).value;
                this.value[0].length = 3;
                this.col = 3;
            } else {
                throw new Error('The coordinate transformation requires a coordinate matrix!');
            }
            return this;
        },

        // 围绕一条平行Z轴的线（x,y）旋转deg度，单位弧度[x->y方向]
        'rotatePZ': function (x, y, deg) {
            if (this.row == 3 && this.col == 1) {
                this.value[3] = [1];
                this.row = 4;
                this.value = JsMatrix.Determinant.rotatePZ(x, y, deg).mult(this).value;
                delete this.value[3];
                this.row = 3;
            } else if (this.row == 1 && this.col == 3) {
                this.value[0][3] = 1;
                this.col = 4;
                this.value = this.mult(JsMatrix.Determinant.rotatePZ(x, y, deg).invert()).value;
                this.value[0].length = 3;
                this.col = 3;
            } else {
                throw new Error('The coordinate transformation requires a coordinate matrix!');
            }
            return this;
        }

    });

})((typeof window !== "undefined" ? window : this).JsMatrix);
/*!======= scale.js =======*/
(function (JsMatrix, undefined) {

    // 扩展JsMatrix对象上的方法
    JsMatrix.prototype.extend({

        // 以原点为中心缩放rate倍
        'scaleOrigin': function (rate) {
            if (this.row == 3 && this.col == 1) {
                this.value = JsMatrix.Determinant.scaleOrigin(rate).mult(this).value;
            } else if (this.row == 1 && this.col == 3) {
                this.value = this.mult(JsMatrix.Determinant.scaleOrigin(rate)).value;
            } else {
                throw new Error('The coordinate transformation requires a coordinate matrix!');
            }
            return this;
        },

        // 以指定的点(a,b,c)为中心缩放rate倍
        'scale': function (a, b, c, rate) {
            if (this.row == 3 && this.col == 1) {
                this.value[3] = [1];
                this.row = 4;
                this.value = JsMatrix.Determinant.scale(a, b, c, rate).mult(this).value;
                delete this.value[3];
                this.row = 3;
            } else if (this.row == 1 && this.col == 3) {
                this.value[0][3] = 1;
                this.col = 4;
                this.value = this.mult(JsMatrix.Determinant.scale(a, b, c, rate)).value;
                this.value[0].length = 3;
                this.col = 3;
            } else {
                throw new Error('The coordinate transformation requires a coordinate matrix!');
            }
            return this;
        }

    });

})((typeof window !== "undefined" ? window : this).JsMatrix);
/*!======= move.js =======*/
(function (JsMatrix, undefined) {

    // 扩展JsMatrix对象上的方法
    JsMatrix.prototype.extend({

        // 沿着X轴方向移动
        'moveX': function (dis) {
            if (this.row == 3 && this.col == 1) {
                this.value[3] = [1];
                this.row = 4;
                this.value = JsMatrix.Determinant.moveX(dis).mult(this).value;
                delete this.value[3];
                this.row = 3;
            } else if (this.row == 1 && this.col == 3) {
                this.value[0][3] = 1;
                this.col = 4;
                this.value = this.mult(JsMatrix.Determinant.moveX(dis)).value;
                this.value[0].length = 3;
                this.col = 3;
            } else {
                throw new Error('The coordinate transformation requires a coordinate matrix!');
            }
            return this;
        },

        // 沿着Y轴方向移动
        'moveY': function (dis) {
            if (this.row == 3 && this.col == 1) {
                this.value[3] = [1];
                this.row = 4;
                this.value = JsMatrix.Determinant.moveY(dis).mult(this).value;
                delete this.value[3];
                this.row = 3;
            } else if (this.row == 1 && this.col == 3) {
                this.value[0][3] = 1;
                this.col = 4;
                this.value = this.mult(JsMatrix.Determinant.moveY(dis)).value;
                this.value[0].length = 3;
                this.col = 3;
            } else {
                throw new Error('The coordinate transformation requires a coordinate matrix!');
            }
            return this;
        },

        // 沿着Z轴方向移动
        'moveZ': function (dis) {
            if (this.row == 3 && this.col == 1) {
                this.value[3] = [1];
                this.row = 4;
                this.value = JsMatrix.Determinant.moveZ(dis).mult(this).value;
                delete this.value[3];
                this.row = 3;
            } else if (this.row == 1 && this.col == 3) {
                this.value[0][3] = 1;
                this.col = 4;
                this.value = this.mult(JsMatrix.Determinant.moveZ(dis)).value;
                this.value[0].length = 3;
                this.col = 3;
            } else {
                throw new Error('The coordinate transformation requires a coordinate matrix!');
            }
            return this;
        },

        // 沿着从原点出发，经过(a.b.c)的一条射线移动
        'moveLine': function (a, b, c, dis) {
            if (this.row == 3 && this.col == 1) {
                this.value[3] = [1];
                this.row = 4;
                this.value = JsMatrix.Determinant.moveLine(a, b, c, dis).mult(this).value;
                delete this.value[3];
                this.row = 3;
            } else if (this.row == 1 && this.col == 3) {
                this.value[0][3] = 1;
                this.col = 4;
                this.value = this.mult(JsMatrix.Determinant.moveLine(a, b, c, dis)).value;
                this.value[0].length = 3;
                this.col = 3;
            } else {
                throw new Error('The coordinate transformation requires a coordinate matrix!');
            }
            return this;
        }

    });

})((typeof window !== "undefined" ? window : this).JsMatrix);