from flask import Flask, jsonify, request, render_template
app = Flask(__name__)
'''
@app.route('/tinytowns')
def tinytowns():
    return render_template('tinytowns.html')

@app.route('/php/js2php.php')
def js2phpresult() :
    return render_template('js2php.php')




@app.route('/js2php', methods=['GET', 'POST'])
def js2php():
    if request.method == 'POST':
        jsval = request.form.get('jsval')
        return f"The submitted value is: {jsval}"
    return render_template('js2php.html')

@app.route('/index')
def index():
    return render_template('index.html')

'''

@app.route('/gameover/<end_state>')
def gameover(end_state):
    return '<h1>your game has ended</h1>'
    
@app.route('/')
def hello():
    return '<h1>Hello World</h1>'

@app.route('/add/<int:x>/<int:y>/')
#@app.route('/add')
def add():
    x = int(request.args.get('x'))
    y = int(request.args.get('y'))
    d ={'x': x, 'y': y,
    'total': x + y}
    return jsonify(d)

@app.route('/score/<board>')
def score(board):
    s = 0
    for b in board:
        if b == "w":
            s += 2
    return jsonify({"score": s})

#tictactoe route
#returns dictionary {'winner':'X","O","TIE","NONE"}
#tictactoe?board=XXO---OXX

@app.route('/tictactoe/<state>')

def tictactoe(state):
    board = {}
    winning_lines = [[1,2,3],[4,5,6],[7,8,9],[1,4,7],[2,5,8],[3,6,9],[1,5,9],[3,5,7]]
    i = 1
    dash_count = 0
    for s in state:
        board[i] = state[i-1]
        if state[i-1] == '-':
            dash_count += 1
        i += 1
    for line in winning_lines:
        if board[line[0]] == board[line[1]] == board[line[2]] and board[line[0]] in ['x','o','X','O']:
            return jsonify(board[line[0]])
    if dash_count == 0:
        return jsonify({"winner": "tie"})
    else:
        return jsonify({"winner": "none"})






if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080, debug=True)