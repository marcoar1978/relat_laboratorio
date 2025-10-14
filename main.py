from app import create_app
import webview

# Cria a instância do aplicativo para a aplicação
app = create_app()
# webview.create_window('Relatório', app,width=1000,height=600, resizable=False, confirm_close=True)


if __name__ == '__main__':
    app.run(debug=True, port=8011)
    # webview.start()
