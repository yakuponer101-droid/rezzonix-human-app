from kivymd.app import MDApp
from kivymd.uix.screen import MDScreen
from kivymd.uix.boxlayout import MDBoxLayout
from kivymd.uix.label import MDLabel
from kivymd.uix.button import MDRaisedButton
from kivymd.uix.progressbar import MDProgressBar
from kivy.clock import Clock


class RezzonixHumanApp(MDApp):
    def build(self):
        self.title = "Rezzonix Human Analyzer"
        self.theme_cls.theme_style = "Dark"
        self.theme_cls.primary_palette = "Cyan"

        self.progress = 0

        screen = MDScreen()
        layout = MDBoxLayout(
            orientation="vertical",
            padding=40,
            spacing=30
        )

        title = MDLabel(
            text="REZZONIX HUMAN",
            halign="center",
            font_style="H4"
        )

        subtitle = MDLabel(
