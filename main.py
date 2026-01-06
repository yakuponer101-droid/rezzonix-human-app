from kivymd.app import MDApp
from kivymd.uix.screen import MDScreen
from kivymd.uix.boxlayout import MDBoxLayout
from kivymd.uix.label import MDLabel
from kivymd.uix.button import MDRaisedButton
from kivymd.uix.progressbar import MDProgressBar
from kivy.clock import Clock


class RezzonixHumanApp(MDApp):
    def build(self):
        self.title = "Rezzonix İnsan"
        self.theme_cls.theme_style = "Dark"
        self.theme_cls.primary_palette = "Cyan"

        self.progress_value = 0

        screen = MDScreen()
        layout = MDBoxLayout(orientation="vertical", padding=40, spacing=20)

        self.label = MDLabel(
            text="Rezzonix Human Analyzer (Demo)",
            halign="center",
            font_style="H5",
        )

        self.progress = MDProgressBar(value=0)

        btn = MDRaisedButton(
            text="Analizi Başlat",
            pos_hint={"center_x": 0.5},
            on_release=self.start_analysis,
        )

        layout.add_widget(self.label)
        layout.add_widget(self.progress)
        layout.add_widget(btn)
        screen.add_widget(layout)
        return screen

    def start_analysis(self, *args):
        self.progress_value = 0
        self.label.text = "Analiz sürüyor..."
        Clock.schedule_interval(self.tick, 0.1)

    def tick(self, dt):
        self.progress_value += 2
        self.progress.value = self.progress_value
        if self.progress_value >= 100:
            self.label.text = "Analiz tamamlandı ✅"
            return False
        return True


if __name__ == "__main__":
    RezzonixHumanApp().run()
