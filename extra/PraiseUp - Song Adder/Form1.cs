using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;
using System.Windows.Forms;
using Newtonsoft.Json;
using System.Net.Http;
using System.Threading.Tasks;

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
            try {

                if (textBox1.Text.Length == 0 || textBox7.Text.Length == 0) return;
                else {
                    button2.Enabled = false;

                    Guid id = Guid.NewGuid();

                    var song = new Song {
                        id = "S" + id,
                        type = "song",
                        title = textBox1.Text.Trim(),
                        artist = textBox2.Text.Length == 0 ? null : textBox2.Text.Trim(),
                        cover = null,
                        initialChord = textBox3.Text.Trim(),
                        order = textBox4.Text.Length == 0 ? null : textBox4.Text.Trim(),
                        lyrics = textBox7.Text.Trim()
                    };

                    string fileName = song.title + ".json";

                    bool gistExists = await CheckIfGistExists(fileName);

                    if (gistExists) {
                        MessageBox.Show($"Cantecul '{song.title}' exista deja pe GitHub Gist.");
                    }
                    else {
                        string jsonData = JsonConvert.SerializeObject(song, Formatting.Indented);
                        string gistUrl = await UploadJsonToGist(fileName, jsonData);

                        if (!string.IsNullOrEmpty(gistUrl)) {
                            MessageBox.Show("Cantec salvat si incarcat pe GitHub Gist!");
                        }
                        else {
                            MessageBox.Show("Cantecul nu a putut fi incarcat pe GitHub Gist.");
                        }
                    }

                    UpdateUI(true);

                    button2.Enabled = true;

                    textBox1.Text = "";
                    textBox2.Text = "";
                    textBox3.Text = "";
                    textBox5.Text = "";
                    textBox6.Text = "";
                    textBox7.Text = "";
                    textBox4.Text = "";
                }
            }
            catch (Exception ex) {
                MessageBox.Show(ex.Message);
            }
        }

        private async Task<bool> CheckIfGistExists(string fileName) {
            string githubToken = Environment.GetEnvironmentVariable("GITHUB_OAUTH_TOKEN");

            if (string.IsNullOrEmpty(githubToken)) {
                MessageBox.Show("GitHub OAuth token is missing!");
                return false;
            }

            using (var client = new HttpClient()) {
                client.DefaultRequestHeaders.Add("Authorization", $"token {githubToken}");
                client.DefaultRequestHeaders.Add("User-Agent", "CSharp-GistUploader");

                var response = await client.GetAsync("https://api.github.com/gists");

                if (response.IsSuccessStatusCode) {
                    var jsonResponse = await response.Content.ReadAsStringAsync();
                    dynamic gists = JsonConvert.DeserializeObject(jsonResponse);

                    foreach (var gist in gists) {
                        var files = gist.files;
                        foreach (var file in files) {
                            string gistFileName = file.Name.ToString();
                            if (gistFileName.Equals(fileName, StringComparison.OrdinalIgnoreCase)) {
                                return true;
                            }
                        }
                    }
                }
                else {
                    MessageBox.Show("Failed to fetch Gists: " + response.ReasonPhrase);
                }
            }

            return false;
        }


        private async Task<string> UploadJsonToGist(string fileName, string jsonData) {
            string githubToken = Environment.GetEnvironmentVariable("GITHUB_OAUTH_TOKEN");

            if (string.IsNullOrEmpty(githubToken)) {
                MessageBox.Show("GitHub OAuth token is missing!");
                return null;
            }

            var gistContent = new {
                description = "Song JSON File Upload",
                @public = false,
                files = new Dictionary<string, object> {
                    { fileName, new { content = jsonData } }
                }
            };

            using (var client = new HttpClient()) {
                client.DefaultRequestHeaders.Add("Authorization", $"token {githubToken}");
                client.DefaultRequestHeaders.Add("User-Agent", "CSharp-GistUploader");

                var jsonContent = new StringContent(JsonConvert.SerializeObject(gistContent), Encoding.UTF8, "application/json");
                var response = await client.PostAsync("https://api.github.com/gists", jsonContent);

                if (response.IsSuccessStatusCode) {
                    var responseJson = await response.Content.ReadAsStringAsync();
                    dynamic gistResponse = JsonConvert.DeserializeObject(responseJson);
                    return gistResponse.html_url;
                }
                else {
                    MessageBox.Show("Failed to create Gist: " + response.ReasonPhrase);
                    return null;
                }
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

            for (int i = 0; i < withChords.Length && j < withoutChords.Length; i++) {
                if (withChords[i] == withoutChords[j]) {
                    if (chord.Length != 0) {
                        result.Append("[" + chord + "]");
                        chord.Clear();
                    }
                    result.Append(withoutChords[j]);
                    j++;
                }
                else {
                    while (withChords[i] != withoutChords[j] && i < withChords.Length) {
                        chord.Append(withChords[i]);
                        i++;
                    }
                    i--;
                }
            }

            return result.ToString();
        }



        private void button3_Click(object sender, EventArgs e) {
            try {
                if (textBox5.Text.Length == 0) return;

                UpdateUI(false);

                if (textBox6.Text.Length != 0)
                    textBox7.Text = FormatChords(textBox5.Text, textBox6.Text);
                else textBox7.Text = textBox5.Text;

                textBox7.Text = InsertNewLines(textBox7.Text);
                textBox7.Text = RemoveExtraChords(textBox7.Text);
            } catch (Exception ex) {
                MessageBox.Show(ex.Message);
            }
        }

        private string InsertNewLines(string text) {
            StringBuilder result = new StringBuilder();
            char lastChar = text[0];
            result.Append(text[0]);

            for (int i = 1; i < text.Length; i++) {
                if (text[i] == '[') {
                    StringBuilder chord = new StringBuilder();

                    while (text[i] != ']' && i < text.Length) {
                        chord.Append(text[i]);
                        i++;
                    }
                    chord.Append(text[i]);
                    i++;

                    result.Append(chord);

                    if (char.IsLower(lastChar) && char.IsUpper(text[i]) || Regex.IsMatch(lastChar.ToString(), @"[`”""'.!?]") && char.IsUpper(text[i])) {
                        result.Append("\r\n\r\n");
                    }
                } else if (char.IsLower(lastChar) && char.IsUpper(text[i]) || Regex.IsMatch(lastChar.ToString(), @"[`”""'.!?]") && char.IsUpper(text[i])) {
                    result.Append("\r\n\r\n");
                }

                result.Append(text[i]);
                lastChar = text[i];
            }

            return result.ToString();
        }

        string RemoveExtraChords(string text) {
            StringBuilder result = new StringBuilder();

            for (int i = 0; i < text.Length; i++) {
                if (text[i] == '/')
                    while (text[i] != ']') 
                        i++;

                while (text[i] == '—')
                    i++;
                    
                result.Append(text[i]);
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
