using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;
using System.Windows.Forms;
using Dropbox.Api.Files;
using Dropbox.Api;
using Newtonsoft.Json;
using Dropbox.Api;
using Dropbox.Api.Files;

namespace PraiseUp {
    public partial class Form1 : Form {
        public Form1() {
            InitializeComponent();

            textBox1.TabIndex = 0;
            textBox2.TabIndex = 1;
            textBox3.TabIndex = 2;
            textBox4.TabIndex = 3;
            textBox5.TabIndex = 4;
            textBox6.TabIndex = 5;
            textBox7.TabIndex = 6;
        }

        public class Song {
            public string id { get; set; }
            public string type { get; set; }
            public string title { get; set; }
            public string artist { get; set; }
            public string cover { get; set; }
            public string initialChord { get; set; }
            public string order { get; set; }
            public string lyrics { get; set; }
        }

        private async void button2_Click(object sender, EventArgs e) {
            if (textBox1.Text.Length == 0 || textBox2.Text.Length == 0 || textBox7.Text.Length == 0) return;
            else {
                Guid id = Guid.NewGuid();

                var song = new Song {
                    id = "S" + id,
                    type = "song",
                    title = textBox1.Text.Trim(),
                    artist = textBox2.Text.Trim(),
                    cover = null,
                    initialChord = textBox3.Text.Trim(),
                    order = textBox4.Text.Length == 0 ? null : textBox4.Text.Trim(),
                    lyrics = textBox7.Text.Trim()
                };

                List<Song> songsList = new List<Song>();

                string filePath = "songs.json";

                if (File.Exists(filePath)) {
                    string existingJson = File.ReadAllText(filePath);
                    songsList = JsonConvert.DeserializeObject<List<Song>>(existingJson) ?? new List<Song>();
                }

                songsList.Add(song);

                File.WriteAllText(filePath, JsonConvert.SerializeObject(songsList, Formatting.Indented));

                string dropboxAccessToken = "sl.B8Wg1M5x2QrIYnZpiw1PndUJ3UFdUe5wxAV40-GbqDYHgEKNFVgloAh47Vl3lZVLq5lG8lcT6PFyq9wMLbcG_migTB-66anYkLCyuDgsgc-ZfGT1EDOFc2z4bPD4JrEqsQd5IGgFs43N";
                using (var dbx = new DropboxClient(dropboxAccessToken)) {
                    using (var memStream = new MemoryStream(Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(song, Formatting.Indented)))) {
                        string fileName = song.id + ".json";
                        string dropboxPath = "/songs/" + fileName;

                        var uploadResult = await dbx.Files.UploadAsync(
                            dropboxPath,
                            WriteMode.Overwrite.Instance,
                            body: memStream);

                        MessageBox.Show("Cantec salvat si incarcat pe Dropbox!");
                    }
                }

                UpdateUI(true);

                textBox1.Text = "";
                textBox2.Text = "";
                textBox3.Text = "";
                textBox5.Text = "";
                textBox6.Text = "";
                textBox7.Text = "";
                textBox4.Text = "";
            }
        }

        private void button1_Click(object sender, EventArgs e) {
            textBox1.Text = "";
            textBox2.Text = "";
            textBox3.Text = "";
            textBox5.Text = "";
            textBox6.Text = "";
            textBox7.Text = "";
            textBox4.Text = "";

            UpdateUI(true);
        }

        private string FormatChords(string withoutChords, string withChords) {
            StringBuilder result = new StringBuilder();
            int j = 0;
            StringBuilder chord = new StringBuilder();

            for (int i = 0; i < withChords.Length; i++) {
                if (withChords[i] == withoutChords[j]) {
                    if (chord.Length != 0) {
                        result.Append("[" + chord + "]");
                        chord.Clear();
                    }
                    result.Append(withoutChords[j]);
                    j++;
                }
                else {
                    while (withChords[i] != withoutChords[j] && i < withChords.Length && j < withoutChords.Length) {
                        chord.Append(withChords[i]);
                        i++;
                    }
                    i--;
                }
            }

            return result.ToString();
        }



        private void button3_Click(object sender, EventArgs e) {
            if (textBox5.Text.Length == 0) return;

            UpdateUI(false);

            if (textBox6.Text.Length != 0)
                textBox7.Text = FormatChords(textBox5.Text, textBox6.Text);
            else textBox7.Text = textBox5.Text;

           textBox7.Text = InsertNewLines(textBox7.Text);
        }

        private string InsertNewLines(string text) {
            StringBuilder result = new StringBuilder();
            char lastChar = text[0];
            result.Append(text[0]);

            for (int i = 1; i < text.Length; i++) {
                if (text[i] == '[') {
                    StringBuilder chord = new StringBuilder();

                    while (text[i] != ']') {
                        chord.Append(text[i]);
                        i++;
                    }
                    chord.Append(text[i]);
                    i++;

                    if (char.IsLower(lastChar) && char.IsUpper(text[i]) || Regex.IsMatch(lastChar.ToString(), @"[.!?-]") && char.IsUpper(text[i])) {
                        result.Append("\r\n\r\n");
                    }

                    result.Append(chord);
                } else if (char.IsLower(lastChar) && char.IsUpper(text[i]) || Regex.IsMatch(lastChar.ToString(), @"[.!?-]") && char.IsUpper(text[i])) {
                    result.Append("\r\n\r\n");
                }

                result.Append(text[i]);
                lastChar = text[i];
            }

            return result.ToString();
        }

        void UpdateUI(bool show) {
            button3.Visible = show;
            textBox5.Visible = show;
            textBox6.Visible = show;
            label4.Visible = show;
            label5.Visible = show;
            label6.Visible = !show;
            textBox7.Visible = !show;
            button2.Visible = !show;
            button4.Visible = !show;
        }

        private void textBox4_TextChanged(object sender, EventArgs e) {
            textBox4.Text = textBox4.Text.Replace("\r\n", " ").Replace("\n", " ");

            textBox4.SelectionStart = textBox4.Text.Length;
            textBox4.SelectionLength = 0;
        }

        private void button4_Click(object sender, EventArgs e) {
            UpdateUI(true);
        }
    }
}
