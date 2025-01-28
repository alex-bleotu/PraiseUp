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
        string token;

        public Form1() {
            InitializeComponent();

            string filePath = "github_oauth_token.txt";

            if (!File.Exists(filePath)) {
                File.WriteAllText(filePath, "");
            }

            token = File.ReadAllText(filePath);

            textBox12.Text = token;

            textBox1.TabIndex = 0;
            textBox2.TabIndex = 1;
            textBox3.TabIndex = 2;
            textBox4.TabIndex = 3;
            textBox8.TabIndex = 4;
            textBox9.TabIndex = 5;
            textBox11.TabIndex = 6;
            textBox10.TabIndex = 7;
            textBox5.TabIndex = 8;
            textBox6.TabIndex = 9;
            textBox7.TabIndex = 10;
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
            public ExtraData extraData { get; set; }
        }

        public class ExtraData {
            public string link { get; set; }
            public string year { get; set; }
            public string originalTitle { get; set; }
            public List<string> verses { get; set; }
        }

        private string TranslateVerse(string verse) {
            switch (verse) {
                // Old Testament
                case "Geneza":
                    return "Genesis";
                case "Exodul":
                    return "Exodus";
                case "Exod":
                    return "Exodus";
                case "Leviticul":
                    return "Leviticus";
                case "Numeri":
                    return "Numbers";
                case "Deuteronomul":
                    return "Deuteronomy";
                case "Deuteronom":
                    return "Deuteronomy";
                case "Iosua":
                    return "Joshua";
                case "Judecători":
                    return "Judges";
                case "Rut":
                    return "Ruth";
                case "1 Samuel":
                    return "1 Samuel";
                case "2 Samuel":
                    return "2 Samuel";
                case "1 Împărați":
                    return "1 Kings";
                case "2 Împărați":
                    return "2 Kings";
                case "1 Cronici":
                    return "1 Chronicles";
                case "2 Cronici":
                    return "2 Chronicles";
                case "Ezra":
                    return "Ezra";
                case "Neemia":
                    return "Nehemiah";
                case "Estera":
                    return "Esther";
                case "Iov":
                    return "Job";
                case "Psalmi":
                    return "Psalms";
                case "Proverbe":
                    return "Proverbs";
                case "Eclesiastul":
                    return "Ecclesiastes";
                case "Cântarea Cântărilor":
                    return "Song of Solomon";
                case "Isaia":
                    return "Isaiah";
                case "Ieremia":
                    return "Jeremiah";
                case "Plângerile lui Ieremia":
                    return "Lamentations";
                case "Ezechiel":
                    return "Ezekiel";
                case "Daniel":
                    return "Daniel";
                case "Osea":
                    return "Hosea";
                case "Ioel":
                    return "Joel";
                case "Amos":
                    return "Amos";
                case "Obadia":
                    return "Obadiah";
                case "Iona":
                    return "Jonah";
                case "Mica":
                    return "Micah";
                case "Naum":
                    return "Nahum";
                case "Habacuc":
                    return "Habakkuk";
                case "Țefania":
                    return "Zephaniah";
                case "Hagai":
                    return "Haggai";
                case "Zaharia":
                    return "Zechariah";
                case "Maleahi":
                    return "Malachi";

                // New Testament
                case "Matei":
                    return "Matthew";
                case "Marcu":
                    return "Mark";
                case "Luca":
                    return "Luke";
                case "Ioan":
                    return "John";
                case "Faptele Apostolilor":
                    return "Acts";
                case "Romani":
                    return "Romans";
                case "1 Corinteni":
                    return "1 Corinthians";
                case "2 Corinteni":
                    return "2 Corinthians";
                case "Galateni":
                    return "Galatians";
                case "Efeseni":
                    return "Ephesians";
                case "Filipeni":
                    return "Philippians";
                case "Coloseni":
                    return "Colossians";
                case "1 Tesaloniceni":
                    return "1 Thessalonians";
                case "2 Tesaloniceni":
                    return "2 Thessalonians";
                case "1 Timotei":
                    return "1 Timothy";
                case "2 Timotei":
                    return "2 Timothy";
                case "Tit":
                    return "Titus";
                case "Filimon":
                    return "Philemon";
                case "Evrei":
                    return "Hebrews";
                case "Iacov":
                    return "James";
                case "1 Petru":
                    return "1 Peter";
                case "2 Petru":
                    return "2 Peter";
                case "1 Ioan":
                    return "1 John";
                case "2 Ioan":
                    return "2 John";
                case "3 Ioan":
                    return "3 John";
                case "Iuda":
                    return "Jude";
                case "Apocalipsa":
                    return "Revelation";

                default:
                    return "Unknown Book";
            }
        }

        private async void button2_Click(object sender, EventArgs e) {
            try {

                if (textBox1.Text.Length == 0 || textBox7.Text.Length == 0) return;
                else {
                    button2.Enabled = false;

                    Guid id = Guid.NewGuid();

                    List<string> verses = new List<string>();
                    if (textBox11.Text.Length != 0) {
                        var words = textBox11.Text.Trim().Split(' ');
                        for (int i = 0; i < words.Length; i++) {
                            if (i < words.Length - 2 && (words[i] == "1" || words[i] == "2")) {
                                string combinedBookName = words[i] + " " + words[i + 1];
                                if (words[i + 2].Contains(":")) {
                                    verses.Add(TranslateVerse(combinedBookName) + " " + words[i + 2]);
                                    i += 2;
                                }
                            }
                            else if (i < words.Length - 1 && words[i + 1].Contains(":")) {
                                verses.Add(TranslateVerse(words[i]) + " " + words[i + 1]);
                                i++;
                            }
                        }
                    }

                    var extraData = new ExtraData {
                        link = textBox8.Text.Length == 0 ? null : textBox8.Text.Trim(),
                        year = textBox9.Text.Length == 0 ? null : textBox9.Text.Trim(),
                        originalTitle = textBox10.Text.Length == 0 ? null : textBox10.Text.Trim(),
                        verses = verses.Count == 0 ? null : verses
                    };

                    var song = new Song {
                        id = "S" + id,
                        type = "song",
                        title = textBox1.Text.Trim(),
                        artist = textBox2.Text.Length == 0 ? null : textBox2.Text.Trim(),
                        cover = null,
                        initialChord = textBox3.Text.Trim(),
                        order = textBox4.Text.Length == 0 ? null : textBox4.Text.Trim(),
                        lyrics = textBox7.Text.Trim(),
                        extraData = extraData
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

                            ResetUI();
                        }
                        else {
                            MessageBox.Show("Cantecul nu a putut fi incarcat pe GitHub Gist.");
                        }
                    }
                }
            }
            catch (Exception ex) {
                MessageBox.Show(ex.Message);
            }

            button2.Enabled = true;
        }

        private async Task<string> TranslateWithMyMemory(string text, string fromLanguage, string toLanguage) {
            using (HttpClient client = new HttpClient()) {
                string url = $"https://api.mymemory.translated.net/get?q={Uri.EscapeDataString(text)}&langpair={fromLanguage}|{toLanguage}";

                HttpResponseMessage response = await client.GetAsync(url);
                if (response.IsSuccessStatusCode) {
                    var jsonResponse = await response.Content.ReadAsStringAsync();
                    dynamic json = JsonConvert.DeserializeObject(jsonResponse);
                    return json.responseData.translatedText;
                }
                else {
                    return text;
                }
            }
        }

        private async Task<bool> CheckIfGistExists(string fileName) {
            string githubToken = token;

            if (string.IsNullOrEmpty(githubToken)) {
                MessageBox.Show("GitHub OAuth token is missing!");
                return false;
            }

            using (var client = new HttpClient()) {
                client.DefaultRequestHeaders.Add("Authorization", $"Bearer {githubToken}");
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
            string githubToken = token;

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

        private void ResetUI() {
            UpdateUI(true);

            textBox1.Text = "";
            textBox2.Text = "";
            textBox3.Text = "";
            textBox5.Text = "";
            textBox6.Text = "";
            textBox7.Text = "";
            textBox4.Text = "";
            textBox8.Text = "";
            textBox9.Text = "";
            textBox10.Text = "";
            textBox11.Text = "";

            button2.Enabled = true;
            button5.Enabled = true;
        }

        private void button1_Click(object sender, EventArgs e) {
            ResetUI();
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

                    if (char.IsLower(lastChar) && char.IsUpper(text[i]) || 
                        Regex.IsMatch(lastChar.ToString(), @"[”""'.!?]") && char.IsUpper(text[i]) || 
                        text[i] == '-' && i + 1 < text.Length && text[i + 1] == '-' && Regex.IsMatch(lastChar.ToString(), @"[”""'.!?]"))
                    {
                        result.Append("\r\n\r\n");
                    }

                    result.Append(chord);
                }
                else if (char.IsLower(lastChar) && char.IsUpper(text[i]) || 
                    Regex.IsMatch(lastChar.ToString(), @"[”""'.!?]") && char.IsUpper(text[i]) || 
                    text[i] == '-' && i + 1 < text.Length && text[i + 1] == '-' && i > 1 && Regex.IsMatch(lastChar.ToString(), @"[”""'.!?]")) 
                {
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
            label12.Visible = !show;
            textBox7.Visible = !show;
            button2.Visible = !show;
            button4.Visible = !show;
            button5.Visible = !show;
        }

        private void textBox4_TextChanged(object sender, EventArgs e) {
            textBox4.Text = textBox4.Text.Replace("\r\n", " ").Replace("\n", " ");

            textBox4.SelectionStart = textBox4.Text.Length;
            textBox4.SelectionLength = 0;
        }

        private void button4_Click(object sender, EventArgs e) {
            UpdateUI(true);
        }

        private async void button5_Click(object sender, EventArgs e) {
            try {
                if (textBox1.Text.Length == 0 || textBox7.Text.Length == 0) return;

                button5.Enabled = false;

                Guid id = Guid.NewGuid();
                List<string> verses = new List<string>();

                // Parsing verses
                if (textBox11.Text.Length != 0) {
                    var words = textBox11.Text.Trim().Split(' ');
                    for (int i = 0; i < words.Length; i++) {
                        if (i < words.Length - 2 && (words[i] == "1" || words[i] == "2")) {
                            string combinedBookName = words[i] + " " + words[i + 1];
                            if (words[i + 2].Contains(":")) {
                                verses.Add(TranslateVerse(combinedBookName) + " " + words[i + 2]);
                                i += 2;
                            }
                        }
                        else if (i < words.Length - 1 && words[i + 1].Contains(":")) {
                            verses.Add(TranslateVerse(words[i]) + " " + words[i + 1]);
                            i++;
                        }
                    }
                }

                var extraData = new ExtraData {
                    link = textBox8.Text.Length == 0 ? null : textBox8.Text.Trim(),
                    year = textBox9.Text.Length == 0 ? null : textBox9.Text.Trim(),
                    originalTitle = textBox10.Text.Length == 0 ? null : textBox10.Text.Trim(),
                    verses = verses.Count == 0 ? null : verses
                };

                var song = new Song {
                    id = "S" + id,
                    type = "song",
                    title = textBox1.Text.Trim(),
                    artist = textBox2.Text.Length == 0 ? null : textBox2.Text.Trim(),
                    cover = null,
                    initialChord = textBox3.Text.Trim(),
                    order = textBox4.Text.Length == 0 ? null : textBox4.Text.Trim(),
                    lyrics = textBox7.Text.Trim(),
                    extraData = extraData
                };

                string fileName = song.title + ".json";
                string jsonData = JsonConvert.SerializeObject(song, Formatting.Indented);

                bool gistExists = await CheckIfGistExists(fileName);

                if (gistExists) {
                    string gistUrl = await UpdateGist(fileName, jsonData);

                    if (!string.IsNullOrEmpty(gistUrl)) {
                        MessageBox.Show($"Cantecul '{song.title}' a fost actualizat pe GitHub Gist!");

                        ResetUI();
                    }
                    else {
                        MessageBox.Show("Cantecul nu a putut fi actualizat pe GitHub Gist.");
                    }
                }
                else {
                    DialogResult dialogResult = MessageBox.Show("Cantecul nu exista. Doresti sa il adaugi?", "Cantecul nu exista", MessageBoxButtons.YesNo);

                    if (dialogResult == DialogResult.Yes) {
                        string gistUrl = await UploadJsonToGist(fileName, jsonData);

                        if (!string.IsNullOrEmpty(gistUrl)) {
                            MessageBox.Show("Cantecul a fost salvat si incarcat pe GitHub Gist!");

                            ResetUI();
                        }
                        else {
                            MessageBox.Show("Cantecul nu a putut fi incarcat pe GitHub Gist.");
                        }
                    }
                }
            }
            catch (Exception ex) {
                MessageBox.Show(ex.Message);
            }

            button5.Enabled = true;
        }

        private async Task<string> UpdateGist(string fileName, string jsonData) {
            string gistId = await GetGistIdByFileName(fileName);

            if (string.IsNullOrEmpty(gistId)) return null;

            var gistUpdateData = new {
                files = new Dictionary<string, object> {
                    [fileName] = new { content = jsonData }
                }
            };

            var content = new StringContent(JsonConvert.SerializeObject(gistUpdateData), Encoding.UTF8, "application/json");

            using (HttpClient client = new HttpClient()) {
                client.DefaultRequestHeaders.Add("Authorization", "Bearer " + token);
                client.DefaultRequestHeaders.Add("User-Agent", "CSharp-App");

                var request = new HttpRequestMessage(new HttpMethod("PATCH"), $"https://api.github.com/gists/{gistId}") {
                    Content = content
                };

                var response = await client.SendAsync(request);

                if (response.IsSuccessStatusCode) {
                    var responseBody = await response.Content.ReadAsStringAsync();
                    dynamic responseJson = JsonConvert.DeserializeObject(responseBody);
                    return responseJson.html_url;
                }
                else {
                    return null;
                }
            }
        }


        private async Task<string> GetGistIdByFileName(string fileName) {
            string githubToken = token;

            if (string.IsNullOrEmpty(githubToken)) {
                MessageBox.Show("GitHub OAuth token is missing!");
                return null;
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
                                return gist.id.ToString();
                            }
                        }
                    }
                }
                else {
                    MessageBox.Show("Failed to fetch Gists: " + response.ReasonPhrase);
                }
            }

            return null;
        }

        private void textBox12_TextChanged(object sender, EventArgs e) {
            string pattern = @"^github_pat_[A-Za-z0-9_]{22}_[A-Za-z0-9_]{59}$";
            Regex regex = new Regex(pattern);

            if (regex.IsMatch(textBox12.Text)) {
                string filePath = "github_oauth_token.txt";

                File.WriteAllText(filePath, textBox12.Text);

                token = textBox12.Text;
            }
        }
    }
}
