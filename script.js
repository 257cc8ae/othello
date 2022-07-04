// 0の時はなし、1のときは黒、2のときは白
// x列目y番目
let production_placement = [
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 1, 2, 0, 0, 0,
    0, 0, 0, 2, 1, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
];
class judgeCanPut {
    constructor(color, x, placement) {
        this.color = color;
        this.x = x;
        this.placement = placement;
        this.row = this.placement.slice(8 * Math.floor(x / 8), 8 * Math.floor(x / 8) + 8);
    }
    CountWaB(a, n, s) {
        let mc = 0
        let pc = 0;
        for (let i = s; i < a.length; i++) {
            const element = a[i];
            if (element === 0) {
                break
            } else if (element === n) {
                mc += 1
                break
            } else {
                pc += 1;
            };
        }
        if (pc >= 1 && mc == 1) {
            return true
        } else {
            return false
        }
    }
    turnOverInRow() {
        // 横列でおけるかどうか判定
        this.row_x = this.x - Math.floor(this.x / 8) * 8;
        if (this.row_x === 0) {
            return this.CountWaB(this.row, this.color, 1)
        } else if (this.row_x === 7) {
            let reversed_row = this.row.reverse();
            return this.CountWaB(reversed_row, this.color, 1)
        } else {
            let first_half_row = this.row.slice(0, this.row_x).reverse();
            let second_half_row = this.row.slice(this.row_x + 1);
            return [this.CountWaB(first_half_row, this.color, 0), this.CountWaB(second_half_row, this.color, 0)].includes(true)
        }
    }
    // 縦列判定
    turnOverInLine() {
        let line_x = (this.x) % 8;
        let line_y = Math.floor(this.x / 8)
        let line = [this.placement[line_x], this.placement[8 + line_x], this.placement[16 + line_x], this.placement[24 + line_x], this.placement[32 + line_x], this.placement[40 + line_x], this.placement[48 + line_x], this.placement[56 + line_x]];
        if (line_y === 0) {
            return this.CountWaB(line, this.color, 1)
        } else if (line_y === 7) {
            return this.CountWaB(line.reverse(), this.color, 1)
        } else {
            let first_half_line = line.slice(0, line_y).reverse();
            let second_half_line = line.slice(line_y + 1);
            return [this.CountWaB(first_half_line, this.color, 0), this.CountWaB(second_half_line, this.color, 0)].includes(true)
        }
    }
    // 斜め判定①（右上がり）
    turnOverInRightDiagonal() {
        let n = this.x;
        let d_half = [];
        let u_half = [];
        while (n + 7 < 64 && n % 8 != 0) {
            n += 7;
            d_half.push(this.placement[n]);
        }
        n = this.x;
        while (n - 7 > 0 && (n + 1) % 8 != 0) {
            n -= 7;
            u_half.push(this.placement[n]);
        }
        return [this.CountWaB(u_half, this.color, 0), this.CountWaB(d_half, this.color, 0)].includes(true)
    }
    // 斜め判定①（右上がり）
    turnOverInLeftDiagonal() {

        let n = this.x;
        let d_half = [];
        let u_half = [];
        while (n + 9 < 64 && (n + 1) % 8 != 0) {
            n += 9;
            d_half.push(this.placement[n]);
        }
        n = this.x;
        while (n - 9 > 0 && n % 8 != 0) {
            n -= 9;
            u_half.push(this.placement[n]);
        }
        return [this.CountWaB(u_half, this.color, 0), this.CountWaB(d_half, this.color, 0)].includes(true)
    }
    thereIsNothing() {
        // 石の有無の確認
        // 石があれば置くことができないのでfalse、石がなければ置くことができるのでtrueを返す
        if (this.placement[this.x] != 0) {
            return false;
        } else {
            return true;
        }
    }

    result() {
        if (this.thereIsNothing() === false) {
            return false
        } else {
            return [this.turnOverInLine(), this.turnOverInRightDiagonal(), this.turnOverInRow(), this.turnOverInLeftDiagonal()].includes(true)
        }

    }
}

class TurnOver extends judgeCanPut {
    turn() {
        let new_placement = this.placement;
        // let pos_x = this.x - Math.floor(this.x / 8) * 8;
        let pos_y = Math.floor(this.x / 8);
        if (this.turnOverInRow()) {
            let i = this.x;
            let min = pos_y * 8;
            let max = pos_y * 8 + 7;
            new_placement[i] = this.color;
            i += 1
            while (i < max + 1 && this.placement[i] != 0 && this.placement[i] != this.color) {
                new_placement[i] = this.color
                i += 1
            }
            i = this.x;
            i -= 1;
            while (i > min - 1 && this.placement[i] != 0 && this.placement[i] != this.color) {
                new_placement[i] = this.color;
                i -= 1
            }
        }
        if (this.turnOverInLine()) {
            let i = this.x;
            new_placement[i] = this.color;
            i += 8;
            while (i < 64 && this.placement[i] != 0 && this.placement[i] != this.color) {
                new_placement[i] = this.color;
                i += 8;
            }
            i = this.x;
            i -= 8;
            while (i >= 0 && this.placement[i] != 0 && this.placement[i] != this.color) {
                new_placement[i] = this.color;

                i -= 8
            }
        }
        if (this.turnOverInRightDiagonal()) {
            let i = this.x;
            new_placement[i] = this.color;
            i -= 7;
            while (i - 7 > 0 && (i + 1) % 8 != 0 && this.placement[i] != 0 && this.placement[i] != this.color) {
                new_placement[i] = this.color;
                i -= 7;
            }
            i = this.x;
            i += 7;
            while (i + 7 < 64 && i % 8 != 0 && this.placement[i] != 0 && this.placement[i] != this.color) {
                new_placement[i] = this.color;

                i += 7
            }
        }

        if (this.turnOverInLeftDiagonal()) {
            let i = this.x;
            new_placement[i] = this.color;
            i -= 9;
            while (i - 9 > 0 && (i + 1) % 8 != 0 && this.placement[i] != 0 && this.placement[i] != this.color) {
                new_placement[i] = this.color;
                i -= 9;
            }
            i = this.x;
            i += 9;
            while (i + 7 < 64 && i % 8 != 0 && this.placement[i] != 0 && this.placement[i] != this.color) {
                new_placement[i] = this.color;

                i += 9
            }
        }
        return new_placement
    }
}

function whereCanPut(color, placement) {
    let result = []
    for (let i = 0; i < 65; i++) {
        let nk = new judgeCanPut(color, i, placement);
        if (nk.result()) {
            result.push(i)
        }
    }
    return result
}

class Optimal_Hand {
    constructor(color, x, placement) {
        this.color = color;
        this.x = x;
        this.placement = placement;
        this.row = this.placement.slice(8 * Math.floor(x / 8), 8 * Math.floor(x / 8) + 8);
    }
    CPU() {
        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
        }
        let wcp = whereCanPut(this.color, this.placement);
        
        let good_zone = [0, 7, 56, 63]
        let result = wcp[getRandomInt(0, wcp.length - 1)];
        for (let i = 0; i < good_zone.length; i++) {
            if (wcp.includes(good_zone[i])) {
                result = good_zone[i]
                break
            }
        }
        let new_placement = new TurnOver(2,result,production_placement)
        return new_placement.turn()
    }
}


function judgeWinOrLose(placement) {
    let black = placement.filter(n => n === 1).length;
    let white = placement.filter(n => n === 2).length;
    if (black > white) {
        alert(`黒${black}対白${white}であなたの負け`)
    } else if (white > black) {
        alert(`黒${black}対白${white}であなたの負け`)
    } else {
        alert(`黒${black}対白${white}で引き分け`)
    }
}

// マス目を生成   

// ボードを生成
function generateBoard(placement) {
    for (let i = 0; i < placement.length; i++) {
        let element = placement[i];
        let can_put_on = new judgeCanPut(1, i, placement);
        if (can_put_on.result() === true) {
            element = 3;
        }

        let trout = document.createElement("div");
        trout.setAttribute("class", "trout");
        trout.setAttribute("id", i);
        let stone = document.createElement("div");
        stone.setAttribute("class", "stone")
        if (element === 1) {
            // 石が黒のときの処理
            stone.setAttribute("class", "stone stone_1");
        } else if (element === 2) {
            // 石が白のときの処理
            stone.setAttribute("class", "stone stone_2")
        } else if (element === 3) {
            // 石をおける時
            trout.onclick = () => {
                document.getElementById("othelloArea").innerHTML = "";
                let new_placement = new TurnOver(1, i, production_placement);
                production_placement = new_placement.turn();
                let cpu_matched_production = new Optimal_Hand(2, 0, production_placement);
                cpu_matched_production = cpu_matched_production.CPU()
                if (cpu_matched_production != undefined) {
                    generateBoard(cpu_matched_production);
                    production_placement = cpu_matched_production;
                } else {
                    generateBoard(production_placement);
                }
                while (whereCanPut(1, production_placement).length === 0 && whereCanPut(2, production_placement).length != 0) {
                    console.log("fuck")
                    document.getElementById("othelloArea").innerHTML = "";
                    let cpu_matched_production = new Optimal_Hand(2, 0, production_placement);
                    cpu_matched_production = cpu_matched_production.CPU()
                    generateBoard(cpu_matched_production);
                    production_placement = cpu_matched_production;
                    if (production_placement.filter(n => n != 0).length === 64) {
                        judgeWinOrLose(production_placement)
                    }

                }
                console.log(production_placement.filter(n => n != 0).length)
                if (production_placement.filter(n => n != 0).length === 64) {
                    judgeWinOrLose(production_placement)
                }

            };
            trout.setAttribute("class", "can_put_on trout")
        };
        trout.appendChild(stone);
        document.getElementById("othelloArea").appendChild(trout);
    };
};


generateBoard(production_placement);

document.getElementById("replay").addEventListener("click", function () {
    location.reload();
})